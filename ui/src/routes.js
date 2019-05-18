import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";
import BareLayout  from "./layouts/BareLayout";

// Route Views
import Messages from "./views/Messages";
import UserProfile from "./views/UserProfile";
import ComponentsOverview from "./views/ComponentsOverview";
import Games from "./views/Games";

import Login from './components/login/Login';
import Register from './components/login/Register';

import {RouteType} from 'router'

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    type: RouteType.NORMAL_ROUTE,
    component: () => <Redirect to="/games" />
  },
  {
    path: "/games",
    type: RouteType.PROTECTED_ROUTE,
    layout: DefaultLayout,
    component: Games
  },
  {
    path: "/messages",
    type: RouteType.NORMAL_ROUTE,
    layout: DefaultLayout,
    component: Messages
  },
  {
    path: "/user-profile",
    type: RouteType.NORMAL_ROUTE,
    layout: DefaultLayout,
    component: UserProfile
  },
  {
    path: "/components-overview",
    type: RouteType.NORMAL_ROUTE,
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/login",
    type: RouteType.AUTH_ROUTE,
    layout: BareLayout,
    component: Login
  },
  {
    path: "/register",
    type: RouteType.AUTH_ROUTE,
    layout: BareLayout,
    component: Register
  }
];
