import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'


export const RouteType  = {
    PROTECTED_ROUTE: 1, // Need login first
    AUTH_ROUTE: 2, // For login, register page
    NORMAL_ROUTE: 3
}


const ProtectedRoute = ({ component: Component, user, ...rest }) => (
    <Route
        render={(props) => (user.isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />)}
        {...rest}
    />
);


const AuthRoute = ({ component: Component, user, ...rest }) => (
    <Route
        render={(props) => (!user.isLoggedIn ? <Component {...props} /> : <Redirect to="/" />)}
        {...rest}
    />
);

const mapStateToProps = (state) => ({
    user: state.userReducer
})

const connectedProtectedRoute = connect(mapStateToProps)(ProtectedRoute);
const connectedAuthRoute = connect(mapStateToProps)(AuthRoute);

export { connectedProtectedRoute as ProtectedRoute,  connectedAuthRoute as AuthRoute}; 