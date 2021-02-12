import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Segment, Comment } from 'semantic-ui-react'
import styled from 'styled-components'

import firebase from '../../server/firebase'

import { setFavouriteChannel, removeFavouriteChannel } from '../../store/actions/actionCreator'

import MessageHeader from './MessageHeader'
import MessageInput from './MessageInput'
import MessageContent from './MessageContent'

import '../../styles/Messages.css'

const MessageContentContainer = styled(Segment)`
    height: 500px;
    overflow-y: scroll;

`

const Messages = (props) => {

    const [messagesState, setMessagesState] = useState([])
    const [searchTermState, setSearchTermState] = useState('')
    const [starred, setStarred] = useState(false)

    const messageRef = firebase.database().ref('messages')
    const userRef = firebase.database().ref('users')

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

    useEffect(() => {
        if(props.user){
            // Add
            userRef.child(props.user.uid).child('favourite')
                .on('child_added', (snap) => {
                    props.setFavouriteChannel(snap.val())
                })
            // Remove
            userRef.child(props.user.uid).child('favourite')
                .on('child_removed', (snap) => {
                    props.removeFavouriteChannel(snap.val())
                })

            return () => userRef.child(props.user.uid).child('favourite').off()
        }
    }, [props.user])

    const displayMessages = () => {
        let messagesToDisplay = searchTermState 
            ? filterMessageBySearchTerm() 
            : messagesState

        if(messagesToDisplay.length > 0 && props.user) {
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

    const starChange = () => {
        let favouriteRef = userRef.child(props.user.uid).child('favourite').child(props.channel.id)
        if(isStarred()) {
            setStarred(false)
            favouriteRef.remove() 
        } else {
            favouriteRef.set({
                channelId: props.channel.id, 
                channelName: props.channel.name
            })
            setStarred(true)
        }
    }

    const isStarred = () => {
        return props.channel && Object.keys(props.favouriteChannels).includes(props.channel.id) && starred
    }

    return(
        <div>
            <MessageHeader
                starChange={starChange}
                starred={isStarred()} 
                isPrivateChat={props.channel?.isPrivateChat}
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
        channel: state.channel.currentChannel,
        favouriteChannels: state.favouriteChannel
    }
}

const mapDispatchToProps  = dispatch => {
    return {
        setFavouriteChannel: channel => dispatch(setFavouriteChannel(channel)),
        removeFavouriteChannel: channel => dispatch(removeFavouriteChannel(channel))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages)