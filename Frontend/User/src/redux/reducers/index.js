import {combineReducers} from 'redux';
import {TokenReducers} from './TokenReducers';
import { RequestReducers } from './RequestReducers';
import { PaginationReducers } from './PaginationReducers';
import { ViewDetailReducers } from './ViewDetailReducers';

export default combineReducers({
    tokenReducer: TokenReducers,
    request: RequestReducers,
    paging: PaginationReducers,
    viewDetail: ViewDetailReducers
});