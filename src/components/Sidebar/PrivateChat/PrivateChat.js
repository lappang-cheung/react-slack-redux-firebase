import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu, Icon } from 'semantic-ui-react'

import firebase from '../../../server/firebase'
import { setChannel } from '../../../store/actions/actionCreator'

const PrivateChat = (props) => {

    const [userState, setUserState] = useState([])

    const userRef = firebase.database().ref("users")

    useEffect(() => {
        userRef.on('child_added', (snap) => {
            setUserState(currentState => {
                let updatedState = [...currentState]
                let user = snap.val()

                user.name = user.displayName
                user.id = snap.key
                user.isPrivateChat = true
                updatedState.push(user)

                return updatedState
            })
        })

        return () => userRef.off()
    }, [])

    const displayUsers = () => {
        if (userState.length > 0 && props.user) {
            return userState.filter(user => user.id !== props.user.uid).map(user => {
                return <Menu.Item 
                    key={user.id}
                    name={user.name}
                    onClick={() => selectUser(user)}
                    active={props.channel && generateChannelId(user.id) === props.channel.id}
                >
                    @ {user.name}
                </Menu.Item>
            })
        }
    }

    const selectUser = user => {
        let userTemp = {...user}
        userTemp.id = generateChannelId(user.id)
        props.selectChannel(userTemp)
    }

    const generateChannelId = userId => {
        if(props.user.uid < userId) {
            return props.user.uid + userId
        } else {
            return userId + props.user.uid
        }
    }

    return (
        <Menu.Menu>
            <Menu.Item>
                <span>
                    <Icon name="mail" /> Chat
                </span>
                ({userState.length - 1})
            </Menu.Item>
            {displayUsers()}
        </Menu.Menu>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        channel: state.channel.currentChannel
    }
}

const mapDispatchToProps = dispatch => {
    return {
        selectChannel: channel => dispatch(setChannel(channel))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateChat)