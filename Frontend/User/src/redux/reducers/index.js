import {combineReducers} from 'redux';
import {TokenReducers} from './TokenReducers';
import { RequestReducers } from './RequestReducers';

export default combineReducers({
    tokenReducer: TokenReducers,
    request: RequestReducers
});