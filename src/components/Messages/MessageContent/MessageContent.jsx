// Required Packages
import React from 'react';
import { Comment,Image } from 'semantic-ui-react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import styled from 'styled-components'

// Styled Components
const StyledContent = styled(Comment.Content)`
    border-left : ${props => props.ownMessage ? `2px solid orange` : ''};
    padding-left:  ${props => props.ownMessage ? `6px` : ''};
`
// Set locale
TimeAgo.locale(en);
const timeAgo = new TimeAgo();

const MessageContent = (props) => {
    return (
        <Comment>
            <Comment.Avatar src={props.message.user.avatar} />
            <StyledContent ownMessage={props.ownMessage}>
                <Comment.Author as='a'>{props.message.user.name}</Comment.Author>
                <Comment.Metadata>{timeAgo.format(props.message.timestamp)}</Comment.Metadata>
                {props.message.image ? <Image onLoad={props.imageLoaded} src={props.message.image} /> :
                    <Comment.Text>{props.message.content}</Comment.Text>
                }
            </StyledContent>
        </Comment>
    )
}

export default MessageContent;