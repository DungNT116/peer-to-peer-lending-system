import {SET_TOKEN} from 'redux/action/types'
let STATE = {
    token : ''
}

export const TokenReducers = (state = STATE, action) => {
    // console.log("REDUCER:" , state);
    // console.log(action.type)
    // console.log("test payload " + action.payload)
    switch (action.type) {
        case SET_TOKEN:
            state = {
                ...state,
                token: action.payload
            }
            break;
            // console.log("test token " + state.token)
        default:
            return state;
    }
    return state;
}