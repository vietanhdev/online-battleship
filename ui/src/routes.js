import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";
import BareLayout  from "./layouts/BareLayout";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfile from "./views/UserProfile";
import AddNewPost from "./views/AddNewPost";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";

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
    path: "/user-profile",
    type: RouteType.NORMAL_ROUTE,
    layout: DefaultLayout,
    component: UserProfile
  },
  {
    path: "/dashboard",
    type: RouteType.AUTH_ROUTE,
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/add-new-post",
    type: RouteType.NORMAL_ROUTE,
    layout: DefaultLayout,
    component: AddNewPost
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
  },
  {
    path: "/blog-posts",
    type: RouteType.NORMAL_ROUTE,
    layout: DefaultLayout,
    component: BlogPosts
  }
];
