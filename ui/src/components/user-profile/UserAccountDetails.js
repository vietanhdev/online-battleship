
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

export class UserAccountDetails extends Component {
  render() {
    const {fullname, email, bio} = this.props.user;
    return (
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Details</h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Form>
                  <Row form>
                    {/* Full Name */}
                    <Col md="12" className="form-group">
                      <label htmlFor="feFirstName">Fullname</label>
                      <FormInput
                        id="feFirstName"
                        placeholder="First Name"
                        defaultValue={fullname}
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
                        defaultValue={email}
                        onChange={() => {}}
                        autoComplete="email"
                      />
                    </Col>
                    {/* Password */}
                    <Col md="6" className="form-group">
                      <label htmlFor="fePassword1">Old Password</label>
                      <FormInput
                        type="password"
                        id="fePassword1"
                        placeholder="Password"
                      />
                    </Col>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePassword2">New Password</label>
                      <FormInput
                        type="password"
                        id="fePassword2"
                        placeholder="New password"
                      />
                    </Col>
                  </Row>
                  <Row form>
                    {/* Description */}
                    <Col md="12" className="form-group">
                      <label htmlFor="feDescription">Bio</label>
                      <FormTextarea id="feDescription" rows="5" />
                    </Col>
                  </Row>
                  <Button theme="accent">Update Account</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.userReducer
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccountDetails)
