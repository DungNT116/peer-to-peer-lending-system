import { SET_PAGE_NUMBER } from 'redux/action/types'
let STATE = {
    page: 1
}

export const PaginationReducers = (state = STATE, action) => {
    switch (action.type) {
        case SET_PAGE_NUMBER:
            state = {
                ...state,
                page: action.payload
            }
            break;
        default:
            return state;
    }
    return state;
}