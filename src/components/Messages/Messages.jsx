// Required Packages
import React, { useEffect, useState,useRef } from 'react';
import { connect } from 'react-redux';
import { Segment, Comment } from 'semantic-ui-react';
import styled from 'styled-components'

// Custom Packages
import MessageHeader from './MessageHeader/MessageHeader';
import MessageContent from './MessageContent/MessageContent';
import MessageInput from './MessageInput/MessageInput';
// Redux
import firebase from '../../server/firebase';
import { setfavouriteChannel, removefavouriteChannel } from '../../store/actions/creator';
 
// Styled Components
const StyledMessages = styled.div`
    padding-top : 10px;
`
const StyledMessageContent = styled(Segment)`
    height: 100%;
    overflow-y: auto;
`

const Messages = (props) => {
    // Use state
    const [messagesState, setMessagesState] = useState([]);
    const [searchTermState, setSearchTermState] = useState('');

    // Firebase refs
    const messageRef = firebase.database().ref('messages');
    const usersRef = firebase.database().ref('users');
    let divRef = useRef();

    useEffect(() => {
        if (props.channel) {
            setMessagesState([]);
            messageRef.child(props.channel.id).on('child_added', (snap) => {
                setMessagesState((currentState) => {
                    let updatedState = [...currentState];
                    updatedState.push(snap.val());
                    return updatedState;
                })
            })

            return () => messageRef.child(props.channel.id).off();
        }
    }, [props.channel])

    useEffect(() => {

        if (props.user) {
            usersRef.child(props.user.uid).child('favourite')
                .on('child_added', (snap) => {
                    props.setfavouriteChannel(snap.val());
                })

            usersRef.child(props.user.uid).child('favourite')
                .on('child_removed', (snap) => {
                    props.removefavouriteChannel(snap.val());
                })

            return () => usersRef.child(props.user.uid).child('favourite').off();
        }
    }, [props.user])

    useEffect(()=> {
        divRef.scrollIntoView({behavior : 'smooth'});
    },[messagesState])

    const displayMessages = () => {
        let messagesToDisplay = searchTermState ? filterMessageBySearchTerm() : messagesState;
        if (messagesToDisplay.length > 0 && props.user) {
            return messagesToDisplay.map((message) => {
                return <MessageContent imageLoaded={imageLoaded} ownMessage={message.user.id === props.user.uid} key={message.timestamp} message={message} />
            })
        }
    }

    const imageLoaded= () => {
        divRef.scrollIntoView({behavior : 'smooth'});
    }

    const uniqueusersCount = () => {
        const uniqueUsers = messagesState.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);

        return uniqueUsers.length;
    }

    const searchTermChange = (e) => {
        const target = e.target;
        setSearchTermState(target.value);
    }

    const filterMessageBySearchTerm = () => {
        const regex = new RegExp(searchTermState, 'gi');
        const messages = messagesState.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, []);

        return messages;
    }

    const starChange = () => {
        let favouriteRef = usersRef.child(props.user.uid).child('favourite').child(props.channel.id);
        if (isStarred()) {
            favouriteRef.remove();
        } else {
            favouriteRef.set({ channelId: props.channel.id, channelName: props.channel.name })
        }
    }

    const isStarred = () => {
        return Object.keys(props.favouriteChannels).includes(props.channel?.id);
    }

    return <StyledMessages>
            <MessageHeader starChange={starChange} starred={isStarred()} isPrivateChat={props.channel?.isPrivateChat} searchTermChange={searchTermChange} channelName={props.channel?.name} uniqueUsers={uniqueusersCount()} />
        <StyledMessageContent>
            <Comment.Group>
                {displayMessages()}
                <div ref={currentEl => divRef = currentEl}></div>
            </Comment.Group>
        </StyledMessageContent>
        <MessageInput /></StyledMessages>
}

const mapStateToProps = (state) => {
    return {
        channel: state.channel.currentChannel,
        user: state.user.currentUser,
        favouriteChannels: state.favouriteChannel.favouriteChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setfavouriteChannel: (channel) => dispatch(setfavouriteChannel(channel)),
        removefavouriteChannel: (channel) => dispatch(removefavouriteChannel(channel)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);