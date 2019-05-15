import { combineReducers } from 'redux';
import { appReducer } from './app';
import { notifierReducer } from './notifier';

export default combineReducers({
    appReducer,
    notifierReducer
});