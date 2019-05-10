import React, {Component} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from 'react-redux'

import routes from "./routes";
import withTracker from "./withTracker";
import NotFound from "./views/NotFound";

import {notifierActions} from "./redux/notifier"

import {ProtectedRoute, AuthRoute} from 'router'
import {RouteType} from 'router'

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

export const AppContext = React.createContext({});

class App extends Component {

  handleHistoryChange() {
    notifierActions.dismissAlert();
  }
  

  render() {

    return (
      <Router onChange={this.handleHistoryChange}>
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

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(App)