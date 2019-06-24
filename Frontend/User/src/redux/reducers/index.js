import {combineReducers} from 'redux';
import {TokenReducers} from './TokenReducers';
import { RequestReducers } from './RequestReducers';
import { PaginationReducers } from './PaginationReducers';

export default combineReducers({
    tokenReducer: TokenReducers,
    request: RequestReducers,
    paging: PaginationReducers
});