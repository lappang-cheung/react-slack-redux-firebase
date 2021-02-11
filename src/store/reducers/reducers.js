import { SET_USER, SET_CHANNEL } from '../actions/actionTypes'
import { combineReducers } from 'redux'

let defaultUserState = {
    currentUser: null
}

let defaultChannelState = {
    currentChannel: null
}

const userReducer = (state = defaultUserState, action) => {
    if(action.type === SET_USER) {
        let payload = action.payload
        state = { ...payload }
        return state
    }
    
    return state
}

const channelReducer = (state = defaultChannelState, action) => {
    if(action.type === SET_CHANNEL) {
        let payload = action.payload
        state = { ...payload }
        return state
    }
    
    return state
}

export const combinedReducers = combineReducers({
    user: userReducer,
    channel: channelReducer
})