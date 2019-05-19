
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormTextarea,
  Button
} from "shards-react";


import React, { Component } from 'react'
import { connect } from 'react-redux'
import {userActions} from '../../redux/users'
import {notifierActions} from '../../redux/notifier'

export class UserAccountDetails extends Component {

  constructor(props) {
    super(props);

    const {fullname, email, bio} = this.props.user;
    this.state = {
      fullname: fullname,
      email: email,
      bio: bio,
      old_password: "",
      new_password: "",
      new_password_again: "",
      change_password: false
    }
  }

  changePasswordToggle = () => {
    this.setState({
      ...this.state,
      change_password: !this.state.change_password
    })
  }

  updateUserInfo(event) {
    event.preventDefault();
    const user = this.state;

    if (!user.change_password) {
      delete user.new_password;
      delete user.new_password_again;
      delete user.old_password;
    } else if (user.new_password !== user.new_password_again) {
      notifierActions.showError("Password confirmation is different from new password.");
      return;
    }
    
    notifierActions.showInfo("Please wait...")
    this.props.updateUser(user);
  }

  handleChange = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    })
  }

  render() {
    
    return (
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Details</h6>
        </CardHeader>
        <Form onSubmit={this.updateUserInfo.bind(this)}>
          <ListGroup flush>
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                    <Row form>
                      {/* Full Name */}
                      <Col md="12" className="form-group">
                        <label htmlFor="feFirstName">Fullname</label>
                        <FormInput
                          id="feFirstName"
                          placeholder="Full Name"
                          name="fullname"
                          value={this.state.fullname} onChange={this.handleChange} 
                        />
                      </Col>
                    </Row>
                    <Row form>
                      {/* Email */}
                      <Col md="12" className="form-group">
                        <label htmlFor="feEmail">Email</label>
                        <FormInput
                          type="email"
                          id="feEmail"
                          placeholder="Email Address"
                          name="email"
                          value={this.state.email} onChange={this.handleChange} 
                          autoComplete="email"
                        />
                      </Col>
                      {/* Password */}
                      <Col md="2" className="form-group">
                        <Button theme="info" onClick={this.changePasswordToggle}>Change password</Button>
                      </Col>
                      <Col md="3" className="form-group" style={{display: this.state.change_password ? 'block' : 'none' }}>
                        <label>Old password</label>
                        <FormInput
                          type="password"
                          placeholder=""
                          name="old_password"
                          value={this.state.old_password} onChange={this.handleChange} 
                        />
                      </Col>
                      <Col md="3" className="form-group" style={{display: this.state.change_password ? 'block' : 'none' }}>
                        <label>New password</label>
                        <FormInput
                          type="password"
                          placeholder=""
                          name="new_password"
                          value={this.state.new_password} onChange={this.handleChange} 
                        />
                      </Col>
                      <Col md="3" className="form-group" style={{display: this.state.change_password ? 'block' : 'none' }}>
                        <label>Confirm new password</label>
                        <FormInput
                          type="password"
                          placeholder=""
                          name="new_password_again"
                          value={this.state.new_password_again} onChange={this.handleChange} 
                        />
                      </Col>
                    </Row>
                    <Row form>
                      {/* Description */}
                      <Col md="12" className="form-group">
                        <label htmlFor="feDescription">Bio</label>
                        <FormTextarea id="feDescription" rows="5" name="bio" value={this.state.bio} onChange={this.handleChange} />
                      </Col>
                    </Row>
                    <Button theme="accent">Update Account</Button>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        </Form>
      </Card>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.userReducer
})

const mapDispatchToProps = {
  updateUser: userActions.update
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccountDetails)
