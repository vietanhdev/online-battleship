import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Login extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        // this.props.dispatch(userActions.logout());

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;
        if (username && password) {
            
        }
    }

    render() {
        
        const { username, password, submitted } = this.state;
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
                {/* {this.renderLoginError()} */}
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label className="sr-only" htmlFor="email">Email</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                        {submitted && !username &&
                            <div className="help-block">Username is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block" type="submit"
                        disabled={this.state.loggingIn}>
                        <span>Login</span>
                        </button>
                        <Link to="/register">
                        <button className="btn btn-danger btn-block mt-1" type="button"
                            disabled={this.state.loggingIn}>
                            <span>Register  </span>
                        </button>
                        </Link>
                    </div>
                </form>
            </div>

        );
    }
}

function mapStateToProps(state) {
}

const connectedLoginPage = connect(mapStateToProps)(Login);
export default connectedLoginPage; 