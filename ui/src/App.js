import React, {Component} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import routes from "./routes";
import withTracker from "./withTracker";
import NotFound from "./views/NotFound";

import AuthModal from "./components/login/Login"

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

import {ProtectedRoute, AuthRoute} from 'router'

import {RouteType} from 'router'

export const AppContext = React.createContext({});

class App extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    this.state = {
      isAuth: token ? true : false,
      username: '',
    };

  }

  
  logOut = () => {
    // config before logout
    this.setState({ username: null, isAuth: false });
    localStorage.removeItem('token');
  };

  onLogin = (username, token) => {
    localStorage.removeItem('token');
    localStorage.setItem('token', token);
    console.log(username);
    this.setState({ username, isAuth: true });
  };

  render() {
    const { classes } = this.props;
    const { showLoginModal } = this.state;
    return (
      <Router>
        <AppContext.Provider
          value={{
            state: this.state,
            action: { onLogin: this.onLogin, logOut: this.logOut },
          }}
        >
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
        
        </AppContext.Provider>
      </Router>
    );
  }
}

export default App;