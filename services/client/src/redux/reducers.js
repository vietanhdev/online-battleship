import { combineReducers } from 'redux';
import { appReducer } from './app';
import { notifierReducer } from './notifier';
import { userReducer } from './users';
import { gameReducer } from './games';
import { friendReducer } from './friends';
import { privateMessageReducer } from './private_messages';
import { roomMessageReducer } from './room_messages';

export default combineReducers({
    appReducer,
    notifierReducer,
    userReducer,
    gameReducer,
    friendReducer,
    privateMessageReducer,
    roomMessageReducer
});
