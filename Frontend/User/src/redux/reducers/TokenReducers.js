import {SET_TOKEN} from 'redux/action/types'
let STATE = {
    token : ''
}

export const TokenReducers = (state = STATE, action) => {
    switch (action.type) {
        case SET_TOKEN:
            state = {
                ...state,
                token: action.payload
            }
            break;
        default:
            return state;
    }
    return state;
}