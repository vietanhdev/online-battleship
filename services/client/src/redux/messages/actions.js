import request from '../../utilities/http'
import messageConstants from './constants'

import {notifierActions} from '../notifier/actions'

export const messageActions = {


    clearMessages: () => dispatch => {
        dispatch({
            type: messageConstants.CLEAR_MESSAGES
        });
    },


    fetchAllMessages: (roomId) => dispatch => {

        // Load old messages
        request.get("/messages/"+roomId+"?offset=0&limit=20")
        .then((response) => {
            let messages = response.data.data;

            // Sort messages by time
            messages = messages.sort(function(x, y) {
                if (parseFloat(x.created_at) < parseFloat(y.created_at)) return -1;
                if (parseFloat(x.created_at) > parseFloat(y.created_at)) return 1;
                return 0;
            });

            dispatch({
                type: messageConstants.FETCH_MESSAGES_SUCCESS,
                payload: messages
            });
       
        })
        .catch((error) => {
            // Clear messages
            dispatch(this.clearMessages());
            notifierActions.showError("Error on fetching messages");
        })
    },


    pushNewMessage : (content) => dispatch => {
        dispatch({
            type: messageConstants.PUSH_NEW_MESSAGE,
            payload: content
        });
    }

}