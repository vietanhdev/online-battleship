import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import {userActions} from '../../redux/users'

import {notifierActions} from '../../redux/notifier'

import { withRouter } from "react-router";

class Login extends React.Component {
  

  submit(event) {
    event.preventDefault();

    const email = this.refs.email.value;
    const password = this.refs.password.value;
    
    notifierActions.showInfo("Please wait...")

    this.props.login(email, password, this.props.history);
  }

  render() {
    return (
      <div className="login-form" style={{marginTop: "5rem"}}>
        <div className="d-table m-auto">
          <Link to="/">
            <img
              id="main-logo"
              className="d-inline-block align-top mr-1"
              style={{ maxWidth: "6rem" }}
              src={require("../../images/horse.svg")}
              alt="iCT Gaming Zone"
            />
            <h2 className="d-md-block ml-1">
              iCTGamingZone
            </h2>
          </Link>
        </div>
        <h2>Login</h2>
        <form onSubmit={this.submit.bind(this)} noValidate>
          <div className="form-group">
            <label className="sr-only" htmlFor="email">Email</label>
            <input  style={{border: "1px solid"}} className="form-control"
              ref="email" placeholder="Email"/>
          </div>
          <div className="form-group">
            <label className="sr-only" htmlFor="password">Password</label>
            <input  style={{border: "1px solid"}} className="form-control" type="password"
              ref="password" placeholder="Password"/>
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block" type="submit"
              >
              <span>Login</span>
            </button>
            <Link to="/register">
              <button className="btn btn-danger btn-block mt-1" type="button">
                <span>Register</span>
              </button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
    login: userActions.login
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login))
