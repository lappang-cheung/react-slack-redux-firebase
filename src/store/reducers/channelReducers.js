import { 
    SET_CHANNEL, 
    SET_FAVOURITECHANNEL, 
    REMOVE_FAVOURITECHANNEL 
} from '../actions/types';

let defaultChannelState = {
    currentChannel: null,
    loading : true
}


export const channelReducer = (state = defaultChannelState, action) => {
    if (action.type === SET_CHANNEL) {
        let payload = action.payload;
        state = { ...payload };
        state.loading= false;
        return state;
    }
    return state;
}

let defaultFavouriteChannelState = {
    favouriteChannel: {}
}


export const favouriteChannelReducer = (state = defaultFavouriteChannelState, action) => {
    if (action.type === SET_FAVOURITECHANNEL) {
        let payload = action.payload.favouriteChannel;
        let updatedState = { ...state.favouriteChannel };
        updatedState[payload.channelId] = payload.channelName;
        return { favouriteChannel: updatedState };
    } else if (action.type === REMOVE_FAVOURITECHANNEL) {
        let payload = action.payload.favouriteChannel;
        let updatedState = { ...state.favouriteChannel };
        delete updatedState[payload.channelId];
        return { favouriteChannel: updatedState };
    }
    return state;
}