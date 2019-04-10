import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";
import BareLayout  from "./layouts/BareLayout";

// Route Views
import Dashboard from "./views/Dashboard";
import UserProfile from "./views/UserProfile";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";

import Login from './components/login/Login';
import Register from './components/login/Register';

import {RouteType} from 'router'

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    type: RouteType.NORMAL_ROUTE,
    component: () => <Redirect to="/dashboard" />
  },
  {
    path: "/dashboard",
    type: RouteType.PROTECTED_ROUTE,
    layout: DefaultLayout,
    component: Dashboard
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
    path: "/tables",
    type: RouteType.NORMAL_ROUTE,
    layout: DefaultLayout,
    component: Tables
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
