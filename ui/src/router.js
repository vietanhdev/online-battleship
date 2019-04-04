import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AppContext} from './App'


export const RouteType  = {
    PROTECTED_ROUTE: 1, // Need login first
    AUTH_ROUTE: 2, // For login, register page
    NORMAL_ROUTE: 3
}

export const ProtectedRoute = ({ component: Component, ...rest }) => (
    <AppContext.Consumer>
        {({ state: { isAuth } }) => (
        <Route
            render={(props) => (isAuth ? <Component {...props} /> : <Redirect to="/login" />)}
            {...rest}
        />
        )}
    </AppContext.Consumer>
);

export const AuthRoute = ({ component: Component, ...rest }) => (
    <AppContext.Consumer>
        {({ state: { isAuth } }) => (
        <Route
            render={(props) => (!isAuth ? <Component {...props} /> : <Redirect to="/" />)}
            {...rest}
        />
        )}
    </AppContext.Consumer>
);

