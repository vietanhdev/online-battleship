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

            let newUserInfo = Object.assign({}, state);
            newUserInfo.fullname = action.payload.fullname;
            newUserInfo.bio = action.payload.bio || "";
            newUserInfo.email = action.payload.email;

            // Save info in session storage
            localStorage.setItem("user", JSON.stringify(newUserInfo));

            return newUserInfo;

        case userConstants.LOGIN_SUCCESS:

            user = {
                fullname: action.payload.fullname,
                bio: action.payload.bio,
                email: action.payload.email,
                token: action.payload.token,
                public_id: action.payload.public_id,
                isLoggedIn: true
            }

            // Save info in session storage
            localStorage.setItem("user", JSON.stringify(user));

            return Object.assign({}, state, user)

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