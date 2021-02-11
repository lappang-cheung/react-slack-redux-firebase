import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import firebase from '../../server/firebase'

import MessageHeader from './MessageHeader'
import MessageInput from './MessageInput'
import MessageContent from './MessageContent'
import { Segment, Comment } from 'semantic-ui-react'

import '../../styles/Messages.css'

const MessageContentContainer = styled(Segment)`
    height: 500px;
    overflow-y: scroll;

`

const Messages = (props) => {

    const [messagesState, setMessagesState] = useState([])
    const [searchTermState, setSearchTermState] = useState('')

    const messageRef = firebase.database().ref('messages')

    useEffect(() => {
        if(props.channel){
            setMessagesState([])
            messageRef.child(props.channel.id).on('child_added', (snap) => {
                setMessagesState(currentState => {
                    let updatedState = [...currentState]
                    updatedState.push(snap.val())
                    return updatedState
                })
            })

            return () => messageRef.child(props.channel.id).off()
        }
    }, [props.channel])

    const displayMessages = () => {
        let messagesToDisplay = searchTermState 
            ? filterMessageBySearchTerm() 
            : messagesState

        if(messagesToDisplay.length > 0) {
            return messagesToDisplay.map(message => {
                return <MessageContent 
                    ownMessage={message.user.id === props.user.uid}
                    key={message.timestamp} 
                    message={message}
                />
            })
        }
    }

    const uniqueUsersCount = () => {
        const uniqueUsers = messagesState.reduce((acc, message) => {
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name)
            }
            return acc
        }, [])

        return uniqueUsers.length
    }

    const searchTermChange = event => {
        const target = event.target
        setSearchTermState(target.value)
    }

    const filterMessageBySearchTerm = () => {

        const regex = new RegExp(searchTermState, "gi")

        const messages = messagesState.reduce((acc, message) => {
            if((message.content && message.content.match(regex)) || message.user.name.match(regex)){
                acc.push(message)
            }
            return acc
        }, [])

        return messages
    }

    return(
        <div>
            <MessageHeader 
                channelName={props.channel?.name} 
                uniqueUsers={uniqueUsersCount()}
                searchTermChange={searchTermChange}
            />
            <MessageContentContainer>
                <Comment.Group>
                    {displayMessages()}
                </Comment.Group>
            </MessageContentContainer>
            <MessageInput />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        channel: state.channel.currentChannel
    }
}

export default connect(mapStateToProps)(Messages)