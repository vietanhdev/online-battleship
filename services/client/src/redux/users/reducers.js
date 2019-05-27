import userConstants from './constants'

function getUserFromSessStorage() {
    let user = localStorage.getItem("user");
    try {
        user = JSON.parse(user); 
    } catch(e) {}
    if (user == null) {
        user = {
            fullname: "",
            email: "",
            bio: "The best gamer on the Earth.",
            isLoggedIn: false,
            token: "",
            public_id: ""
        }
    }
    return user;
}

const initState = getUserFromSessStorage();

export const userReducer = (state = initState, action) =>  {
    let user = {};
    switch (action.type) {
        case userConstants.UPDATE_SUCCESS:
            return Object.assign({}, state, action.payload);
        case userConstants.LOGIN_SUCCESS:
            return Object.assign({}, state, action.payload)
        case userConstants.LOGOUT_FAIL:
        case userConstants.LOGOUT_SUCCESS:
            user = {
                fullname: "",
                bio: "",
                email: "",
                token: "",
                public_id: "",
                isLoggedIn: false
            }
            return Object.assign({}, state, user)
        default:
            return state
    }
}