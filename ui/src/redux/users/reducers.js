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
            token: ""
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
            newUserInfo.bio = action.payload.bio;
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
                isLoggedIn: true
            }

            return Object.assign({}, state, user)

        case userConstants.LOGOUT_FAIL:
        case userConstants.LOGOUT_SUCCESS:

            user = {
                fullname: "",
                bio: "",
                email: "",
                token: "",
                isLoggedIn: false
            }

            return Object.assign({}, state, user)
        default:
            return state
    }
}