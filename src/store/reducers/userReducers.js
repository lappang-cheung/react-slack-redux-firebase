import { 
    SET_USER
} from '../actions/types';

let defaultUserState = {
    currentUser: null
}

export const userReducer = (state = defaultUserState, action) => {
    if (action.type === SET_USER) {
        let payload = action.payload;
        state = { ...payload };
        return state;
    }
    return state;
}