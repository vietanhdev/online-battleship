import { combineReducers } from 'redux';
import { appReducer } from './app';
import { notifierReducer } from './notifier';
import { userReducer } from './user';

export default combineReducers({
    appReducer,
    notifierReducer,
    userReducer
});