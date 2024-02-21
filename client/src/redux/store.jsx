import { combineReducers, createStore } from 'redux';

import authentication from './reducer';
import navigation from './navigationReducer';
import user from './userReducer';

export const store = createStore(combineReducers({
    authentication,
    user,
    navigation
}));