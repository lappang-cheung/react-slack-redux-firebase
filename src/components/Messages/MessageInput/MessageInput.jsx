// Required Packages
import React, { useState } from 'react';
import { Segment, Input, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ImageUpload } from '../ImageUpload/ImageUpload'
import {v4 as uuidv4} from 'uuid';

// Custom Package
import firebase from '../../../server/firebase';

const MessageInput = (props) => {

    // State
    const [messageState, setMessageState] = useState('');
    const [fileDialogState, setFileDialog] = useState(false);

    // Firebase refs
    const messageRef = firebase.database().ref('messages');
    const storageRef = firebase.storage().ref();

    // Message object
    const createMessageInfo = (downloadUrl) => {
        return {
            user: {
                avatar: props.user.photoURL,
                name: props.user.displayName,
                id: props.user.uid
            },
            content: messageState,
            image : downloadUrl || '',
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }
    }

    // Send Message
    const sendMessage = (downloadUrl) => {
        if (messageState || downloadUrl) {
            messageRef.child(props.channel.id)
                .push()
                .set(createMessageInfo(downloadUrl))
                .then(() => setMessageState(''))
                .catch((err) => console.log(err))
        }
    }

    // Message Input
    const onMessageChange = (e) => {
        const target = e.target;
        setMessageState(target.value);
    }

    // Action Button
    const createActionButtons = () => {
        return <>
            <Button icon='send' onClick={() => {sendMessage() }} />
            <Button icon='upload' onClick={() => setFileDialog(true)} />
        </>
    }

    // Uploading Image
    const uploadImage = (file, contentType) => {
        // Create path
        const filePath = `chat/images/${uuidv4()}.jpg`;
        // Create firebase storage ref
        storageRef.child(filePath).put(file, { contentType: contentType })
            .then((data) => {
                data.ref.getDownloadURL()
                .then((url) => {
                    sendMessage(url);
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }

    return (
        <Segment>
            <Input
                onChange={onMessageChange}
                fluid={true}
                name='message'
                value={messageState}
                label={createActionButtons()}
                labelPosition='right'
            />
            <ImageUpload 
                uploadImage={uploadImage} 
                open={fileDialogState} 
                onClose={() => setFileDialog(false)} 
            />
        </Segment>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser,
        channel: state.channel.currentChannel
    }
}

export default connect(mapStateToProps)(MessageInput);