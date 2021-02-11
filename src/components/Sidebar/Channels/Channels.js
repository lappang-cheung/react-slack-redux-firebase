import { useState } from 'react'
import { connect } from 'react-redux'
import { Menu, Icon, Modal, Segment, Form, Button } from 'semantic-ui-react'

import firebase from '../../../server/firebase'

const Channels = (props) => {

    let channel = {
        name: '',
        description: ''
    }

    const [modalOpenState, setModalOpenState] = useState(false)
    const [channelAddState, setChannelAddState] = useState(channel)
    const [isLoading, setIsLoading] = useState(false)

    const channelsRef = firebase.database().ref("channels")
    
    const modalToggle = () => {
        setModalOpenState(!modalOpenState)
    }

    const handleInput = (event) => {
        let target = event.target
        setChannelAddState((currentState) => {
            let updatedState = {...currentState}
            updatedState[target.name] = target.value
            return updatedState
        })
    }

    const checkIfFormValid = () => {
        return channelAddState && channelAddState.name && channelAddState.description
    }

    const onSubmit = (event) => {
        event.preventDefault()

        if(!checkIfFormValid()){
            return
        }

        const key = channelsRef.push().key
        const channel = {
            id: key,
            name: channelAddState.name,
            description: channelAddState.description,
            created_by: {
                name: props.user.displayName,
                avatar: props.user.photoURL
            }
        }

        setIsLoading(true)
        channelsRef
            .child(key)
            .update(channel)
            .then(() => {
                setChannelAddState({
                    name: '',
                    description: ''
                })
                setChannelAddState(false)
                modalToggle()
            })
            .catch(serverError => {
                console.log(serverError)
            })
    }

    return (
        <>
            <Menu.Menu>
                <Menu.Item>
                    <span>
                        <Icon name="exchange"/> Channels
                    </span>
                    (0)
                </Menu.Item>
                <Menu.Item onClick={modalToggle}>
                    <span>
                        <Icon name="add" /> ADD
                    </span>
                </Menu.Item>
            </Menu.Menu>
            <Modal open={modalOpenState} onClose={modalToggle}>
                <Modal.Header>
                    Create Channel
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Segment stacked>
                            <Form.Input
                                name="name"
                                value={channelAddState.name}
                                onChange={handleInput}
                                type="text"
                                placeholder="Enter Channel Name"
                            />

                            <Form.Input
                                name="description"
                                value={channelAddState.description}
                                onChange={handleInput}
                                type="text"
                                placeholder="Enter Channel Description"
                            />
                        </Segment>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button loading={isLoading} onClick={onSubmit}>
                        <Icon name="checkmark" /> Save
                    </Button>
                    <Button onClick={modalToggle}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(Channels)