import { SET_REQUEST_DATA } from 'redux/action/types'
let STATE = {
    data: {}

}

export const RequestReducers = (state = STATE, action) => {
    switch (action.type) {
        case SET_REQUEST_DATA:
            state = {
                ...state,
                data: action.payload

            }
            break;
        default:
            return state;
    }
    return state;
}