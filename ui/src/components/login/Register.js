import React from 'react';
import Alert from './Alert';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom'

class Register extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loggingIn: false
    };
  }

  submit(event) {
    event.preventDefault();

    const username = this.refs.username.value;
    const password = this.refs.password.value;

    if (username.length === 0 || password.length === 0) {
      return this.setState({
        error: 'Missing email or password.'
      });
    }

    this.setState({
      loggingIn: true,
      error: null
    });

    this.props.onRegister(username, password, (err) => {
      if (err) {
        return this.setState({
          error: err,
          loggingIn: false
        });
      }

    });
  }

  renderRegisterError() {
    if (!this.state.error) return null;

    let message = null;
    message = this.state.error;
    return <Alert type="danger"><strong>{message}</strong></Alert>;
  }

  render() {
    const signInIconClass = (this.state.loggingIn) ?
      this.props.spinnerIconClass : this.props.buttonIconClass;

    return (
      <div className="login-form" style={{marginTop: "5rem"}}>
        <div className="d-table m-auto">
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
        </div>
        <h2>Register</h2>
        {this.renderRegisterError()}
        <form onSubmit={this.submit.bind(this)} noValidate>
          <div className="form-group">
            <label className="sr-only" htmlFor="email">Email</label>
            <input  style={{border: "1px solid"}} className="form-control" autoCapitalize={false}
              ref="email" placeholder="Email" autoFocus disabled={this.loggingIn}/>
          </div>
          <div className="form-group">
            <label className="sr-only" htmlFor="password">Password</label>
            <input  style={{border: "1px solid"}} className="form-control" type="password"
              ref="password" placeholder="Password" disabled={this.loggingIn}/>
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block" type="submit"
              disabled={this.state.loggingIn}>
              <span>Register</span>
              <i className={signInIconClass} style={{marginLeft: 6}}/>
            </button>
            <Link to="/login">
              <button className="btn btn-danger btn-block mt-1" type="button"
                disabled={this.state.loggingIn}>
                <span>Login</span>
                <i className={signInIconClass} style={{marginLeft: 6}}/>
              </button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Register);

Register.defaultProps = {
  heading: PropTypes.string,
  spinnerIconClass: 'fa fa-spinner fa-spin',
  buttonIconClass: 'fa fa-sign-in'
};

Register.propTypes = {
  location: PropTypes.object,
  header: PropTypes.string,
  spinnerIconClass: PropTypes.string,
  loginIconClass: PropTypes.string,
  onRegister: PropTypes.func.isRequired
};