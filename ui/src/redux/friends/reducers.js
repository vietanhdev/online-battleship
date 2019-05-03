import friendConstants from './constants'
import {notifierActions} from '../notifier/actions'

const initState = {
    friends: [
        {
            name: "Viet Anh Nguyen",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        },
        {
            name: "Viet Anh",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        },
        {
            name: "Viet Anh",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        },
        {
            name: "Viet Anh",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        },
        {
            name: "Viet Anh",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        },
        {
            name: "Viet Anh",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        },
        {
            name: "Viet Anh",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        },
        {
            name: "Viet Anh",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        },
        {
            name: "Viet Anh",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        },
        {
            name: "Viet Anh",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        },
        {
            name: "Viet Anh",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        },
        {
            name: "Viet Anh",
            image: require('../../images/avatars/king.png'),
            online: true
        },
        {
            name: "Sy An",
            image: require('../../images/avatars/king.png'),
            online: false
        }
    ]
}

export const friendReducer = (state = initState, action) =>  {
    switch (action.type) {
        case friendConstants.FETCH_FRIENDS_SUCCESS:
            return {...state, friends: action.payload}
        default:
            return state
    }
}