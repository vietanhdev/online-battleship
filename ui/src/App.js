import React, {Component} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";
import NotFound from "./views/NotFound";

import {notifierActions} from "./redux/notifier"

import { connect } from 'react-redux'
import { history } from './helpers';

import {ProtectedRoute, AuthRoute} from 'router'
import {RouteType} from 'router'

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

export const AppContext = React.createContext({});

class App extends Component {
  constructor(props) {
    super(props);

    const { dismissAlert } = this.props;
    history.listen((location, action) => {
        // clear alert on location change
        dismissAlert();
    });
  }

  render() {
    return (
      <Router>
        <Switch>
          {routes.map((route, index) => {
            // route.type = "test"
            if (route.type === RouteType.PROTECTED_ROUTE) {
              return (<ProtectedRoute
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={withTracker(props => {
                    return (
                      <route.layout {...props}>
                        <route.component {...props} />
                      </route.layout>
                    );
                  })}
                />)
            } else if (route.type === RouteType.AUTH_ROUTE) {
              return (<AuthRoute
                key={index}
                path={route.path}
                exact={route.exact}
                component={withTracker(props => {
                  return (
                    <route.layout {...props}>
                      <route.component {...props} />
                    </route.layout>
                  );
                })}
              />)
            } else {
              return (<Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={withTracker(props => {
                  return (
                    <route.layout {...props}>
                      <route.component {...props} />
                    </route.layout>
                  );
                })}
              />)
            }
          })}
          <Route component={NotFound}></Route>
        </Switch>
      </Router>
    );
  }
}


const mapDispatchToProps  = {
  dismissAlert: notifierActions.dismissAlert
}


export default connect(null, mapDispatchToProps)(App); 