import { combineReducers } from 'redux'

import { 
    SET_USER, SET_CHANNEL, SET_FAVOURITE_CHANNEL, REMOVE_FAVOURITE_CHANNEL
} from '../actions/actionTypes'

let defaultUserState = {
    currentUser: null
}

let defaultChannelState = {
    currentChannel: null
}

let defaultFavouriteChannelState = {
    favouriteChannel: {}
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

const favouriteChannelReducer = (state = defaultFavouriteChannelState, action) => {
    if(action.type === SET_FAVOURITE_CHANNEL) {
        let payload = action.payload.favouriteChannel
        let updatedState = { ...state.favouriteChannel }
        updatedState[payload.channelId] = payload.channelName
        return updatedState
    } else if(action.type === SET_FAVOURITE_CHANNEL) {
        let payload = action.payload.favouriteChannel
        let updatedState = { ...state.favouriteChannel }
        delete updatedState[payload.channelId]
        return updatedState
    }
    
    return state
}

export const combinedReducers = combineReducers({
    user: userReducer,
    channel: channelReducer,
    favouriteChannel: favouriteChannelReducer
})