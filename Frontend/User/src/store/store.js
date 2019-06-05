import { createStore } from 'redux';
import reducers from '../redux/reducers/index'
export const store = createStore(reducers);