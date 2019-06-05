import { SET_REQUEST_DATA } from 'redux/action/types'
let STATE = {
    data : {
        amount: 0,
    borrowDate: 0,
    borrower: {
    firstName: '',
    id: 0,
    lastName: '',
    username: ''},
    createDate: 0,
    duration: 0,
    id: 0,
    interestRate: 0,
    status: ''}

}

export const RequestReducers = (state = STATE, action) => {
    // console.log("request REDUCER:" , state);
    // console.log(action.type)
    // console.log("test payload " + action.payload)
    switch (action.type) {
        case SET_REQUEST_DATA:
            state = {
                ...state,
                data: action.payload

            }
            // console.log("test token " + state.a)
        default:
            return state;
    }
    return state;
}