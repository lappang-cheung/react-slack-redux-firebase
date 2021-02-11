import { useState } from 'react'
import { Segment, Input, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import firebase from '../../server/firebase'
import ImageUpload from './ImageUpload'

const MessageInput = (props) => {

    const messageRef = firebase.database().ref('messages')
    const storageRef = firebase.storage().ref()

    const [messageState, setMessageState] = useState('')
    const [fileDialogState, setFileDialogState] = useState(false)

    const createActionButtons = () => {
        return <>
            <Button icon="send" onClick={() => { sendMessage() }}/>
            <Button icon="upload" onClick={() => setFileDialogState(true)} />
        </>
    }

    const onMessageChange = (event) => {
        let target = event.target
        setMessageState(target.value)
    }

    const createMessageInfo = (downloadUrl) => {
        return {
            user: {
                avatar: props.user.photoURL,
                name: props.user.displayName,
                id: props.user.uid
            },
            content: messageState,
            image: downloadUrl || "",
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }
    }

    const uploadImage = (file, contentType) => {
        const filePath = `chat/images/${uuidv4()}.jpg`
        storageRef
            .child(filePath)
            .put(file, {contentType: contentType})
            .then(data => {
                data.ref.getDownloadURL()
                .then(url => {
                    sendMessage(url)
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

    const sendMessage = (downloadUrl) => {
        if(messageState || downloadUrl) {
            messageRef
                .child(props.channel.id)
                .push()
                .set(createMessageInfo(downloadUrl))
                .then(() => setMessageState(''))
                .catch(err => {
                    console.error(err)
                })
        }
    }

    return(
        <Segment>
            <Input 
                onChange={onMessageChange}
                fluid={true}
                name="message"
                value={messageState}
                label={createActionButtons()}
                labelPosition="right"
            />
            <ImageUpload 
                open={fileDialogState}
                onClose={() => setFileDialogState(false)}
                uploadImage={uploadImage}
            />
        </Segment>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        channel: state.channel.currentChannel
    }
}

export default connect(mapStateToProps)(MessageInput)