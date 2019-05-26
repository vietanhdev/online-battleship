/*
 * src/store.js
 * No initialState
 */
import {
    createStore,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';
import soundsMiddleware from 'redux-sounds';

import rootReducer from './reducers';

import Config from '../config'


// ============ Init sockets =================

import io from 'socket.io-client';
let socket = {};
socket.gameRoom = io(Config.GAME_ROOM_SOCKET_ENDPOINT);
socket.gameRoomMessage = io(Config.GAME_ROOM_SOCKET_ENDPOINT);
socket.message = io(Config.MESSAGE_SOCKET_ENDPOINT);


socket.message.on('connect', function () {
    console.log('Mesage Socket: Connected to server');
});
socket.message.on('disconnect', function () {
    console.log('Mesage Socket: Disconnected from server');
});

socket.gameRoom.on('connect', function(){
    console.log('Game Room Socket: Connected to server')
});
socket.gameRoom.on('disconnect', function(){
    console.log('Game Room Socket: Disconnected from server')
});

socket.gameRoomMessage.on('connect', function () {
    console.log('Mesage Socket: Connected to server');
});
socket.gameRoomMessage.on('disconnect', function () {
    console.log('Mesage Socket: Disconnected from server');
});


// ============ Init sound data =================

const soundsData = {

    click: require('../components/games/battle_ship/sounds/click.ogg'),
    gameStarted: require('../components/games/battle_ship/sounds/game_started.ogg'),
    lose: require('../components/games/battle_ship/sounds/lose.ogg'),
    missed: require('../components/games/battle_ship/sounds/missed.ogg'),
    win: require('../components/games/battle_ship/sounds/win.ogg'),
    wounded: require('../components/games/battle_ship/sounds/wounded.ogg'),
  
}

// Pre-load our middleware with our sounds data.
const loadedSoundsMiddleware = soundsMiddleware(soundsData);

export default function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(thunk.withExtraArgument(socket), loadedSoundsMiddleware)
    );
}