import React from 'react';
import Alert from './Alert';
import PropTypes from 'prop-types';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      loggingIn: false
    };
  }

  componentWillMount() {
  }

  submit(event) {
    event.preventDefault();

    const username = this.refs.username.value;
    const password = this.refs.password.value;

    if (username.length === 0 || password.length === 0) {
      return this.setState({
        errorCode: 'missingUsernameOrPassword'
      });
    }

    this.setState({
      loggingIn: true,
      errorCode: null
    });

    this.props.onLogin(username, password, (err) => {
      if (err) {
        return this.setState({
          error: err,
          loggingIn: false
        });
      }

      if (this.props.location.state && this.props.location.state.nextPathname) {
        window.location.href = this.props.location.state.nextPathname;
      } else {
        window.location.href = '/';
      }

      // if (this.props.history) {
      //   // Redirect to whatever URL the user was originally trying to access
      //   if (this.props.location.state && this.props.location.state.nextPathname) {
      //     this.props.history.push(this.props.location.state.nextPathname);
      //   } else {
      //     this.props.history.push('/');
      //   }
      // }
    });
  }

  renderLoginError() {
    if (!this.state.error) return null;

    let message = null;
    switch (this.state.error.code) {
    case 'invalidCredentials':
      message = 'Invalid credentials';
      break;
    case 'missingUsernameOrPassword':
      message = 'Please enter your username and password';
      break;
    default:
      message = 'Unknown sign-in error';
      break;
    }

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
        <h2>Login</h2>
        {this.renderLoginError()}
        <form onSubmit={this.submit.bind(this)} noValidate>
          <div className="form-group">
            <label className="sr-only" htmlFor="email">Email</label>
            <input  style={{border: "1px solid"}} className="form-control" autoCapitalize={false}
              ref="email" placeholder="name@example.com" autoFocus disabled={this.loggingIn}/>
          </div>

          <div className="form-group">
            <label className="sr-only" htmlFor="password">Password</label>
            <input  style={{border: "1px solid"}} className="form-control" type="password"
              ref="password" placeholder="Password" disabled={this.loggingIn}/>
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" type="submit"
              disabled={this.state.loggingIn}>
              <span>Sign-In</span>
              <i className={signInIconClass} style={{marginLeft: 6}}/>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

Login.defaultProps = {
  heading: PropTypes.string,
  spinnerIconClass: 'fa fa-spinner fa-spin',
  buttonIconClass: 'fa fa-sign-in'
};

Login.propTypes = {
  location: PropTypes.object,
  header: PropTypes.string,
  spinnerIconClass: PropTypes.string,
  loginIconClass: PropTypes.string,
  onLogin: PropTypes.func.isRequired
};