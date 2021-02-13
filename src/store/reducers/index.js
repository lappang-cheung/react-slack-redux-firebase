import { combineReducers } from "redux";

import { userReducer } from './userReducers'
import { channelReducer, favouriteChannelReducer} from './channelReducers'

export const combinedReducers = combineReducers({ 
    user: userReducer, 
    channel: channelReducer,
    favouriteChannel : favouriteChannelReducer  
})