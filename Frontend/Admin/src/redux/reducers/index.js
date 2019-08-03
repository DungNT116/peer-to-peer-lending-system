import {combineReducers} from 'redux';
// import {TokenReducers} from './TokenReducers';
import { DocumentReducers } from './DocumentReducers';

export default combineReducers({
    // tokenReducer: TokenReducers,
    document: DocumentReducers,
});