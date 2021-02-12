import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu, Icon } from 'semantic-ui-react'

import firebase from '../../../server/firebase'
import { setChannel } from '../../../store/actions/actionCreator'

const PrivateChat = (props) => {

    const [userState, setUserState] = useState([])
    const [connectedUserState, setConnectedUserState] = useState([])

    const userRef = firebase.database().ref("users")
    const connectedRef = firebase.database().ref(".info/connected")
    const statusRef = firebase.database().ref("status")

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

        connectedRef.on("value", snap => {
            if(props.user && snap.val()) {
                const userStatusRef = statusRef.child(props.user.uid)
                userStatusRef.set(true)
                userStatusRef.onDisconnect().remove()
            }
        })

        return () => {
            userRef.off() 
            connectedRef.off()
        }

    }, [props.user])

    useEffect(() => {
        statusRef.on("child_added", snap => {
            setConnectedUserState(currentState => {
                let updatedState = [...currentState]
                updatedState.push(snap.key)
                return updatedState
            })
        })

        statusRef.on("child_removed", snap => {
            setConnectedUserState(currentState => {
                let updatedState = [...currentState]
                let index = updatedState.indexOf(snap.key)
                updatedState.splice(index, 1)
                return updatedState
            })
        })

        return () => statusRef.off()

    }, userState)

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

    const displayUsers = () => {
        if (userState.length > 0 && props.user) {
            return userState.filter(user => user.id !== props.user.uid).map(user => {
                return <Menu.Item 
                    key={user.id}
                    name={user.name}
                    onClick={() => selectUser(user)}
                    active={props.channel && generateChannelId(user.id) === props.channel.id}
                >
                    <Icon name="circle" color={`${connectedUserState.indexOf(user.id) !== -1 ? "green" : "red"}`}/>
                    @ {user.name}
                </Menu.Item>
            })
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