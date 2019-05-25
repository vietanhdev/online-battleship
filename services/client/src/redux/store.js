/*
 * src/store.js
 * No initialState
 */
import {
    createStore,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';
import rootReducer from './reducers';

import Config from '../config'

// Init sockets
import io from 'socket.io-client';
let socket = {};
socket.gameRoom = io(Config.GAME_ROOM_SOCKET_ENDPOINT);
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

console.log(socket.message)

export default function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(thunk.withExtraArgument(socket))
    );
}