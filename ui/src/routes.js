import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";
import BareLayout  from "./layouts/BareLayout";

// Route Views
import RootMessages from "./views/messages/RootMessages";
import Messages from "./views/messages/Messages";
import UserProfile from "./views/UserProfile";
import ComponentsOverview from "./views/ComponentsOverview";
import Games from "./views/Games";
import PlayGame from "./views/PlayGame";

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
    path: "/games/:game_id/:room_id",
    type: RouteType.PROTECTED_ROUTE,
    layout: DefaultLayout,
    component: PlayGame
  },
  {
    path: "/games",
    type: RouteType.PROTECTED_ROUTE,
    layout: DefaultLayout,
    component: Games
  },
  {
    path: "/messages/:room_id",
    type: RouteType.NORMAL_ROUTE,
    layout: DefaultLayout,
    component: Messages
  },
  {
    path: "/messages",
    type: RouteType.NORMAL_ROUTE,
    layout: DefaultLayout,
    component: RootMessages
  },
  {
    path: "/user-profile",
    type: RouteType.NORMAL_ROUTE,
    layout: DefaultLayout,
    component: UserProfile
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
