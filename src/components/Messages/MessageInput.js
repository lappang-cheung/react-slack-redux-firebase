import { useState } from 'react'
import { Segment, Input, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'

import firebase from '../../server/firebase'

const MessageInput = (props) => {

    const messageRef = firebase.database().ref('messages')
    const [messageState, setMessageState] = useState('')

    const createActionButtons = () => {
        return <>
            <Button icon="send" onClick={onSubmit}/>
            <Button icon="upload" />
        </>
    }

    const onMessageChange = (event) => {
        let target = event.target
        setMessageState(target.value)
    }

    const createMessageInfo = () => {
        return {
            user: {
                avatar: props.user.photoURL,
                name: props.user.displayName,
                id: props.user.uid
            },
            content: messageState,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }
    }

    const onSubmit = () => {
        if(messageState) {
            messageRef
                .child(props.channel.id)
                .push()
                .set(createMessageInfo())
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