
import {
  Card,
  CardHeader,
  Button,
  ListGroup,
  ListGroupItem,
} from "shards-react";
import React, { Component } from 'react'
import { connect } from 'react-redux'

export class UserDetails extends Component {

  render() {
    const {public_id, photo, fullname, bio} = this.props
    return (
      <Card small className="mb-4 pt-3">
        <CardHeader className="border-bottom text-center">
          <div className="mb-3 mx-auto">
            <img
              className="rounded-circle"
              src={photo}
              alt={fullname}
              width="110"
            />
          </div>
          <h4 className="mb-0">{fullname}</h4>
          <p>Your ID is: <span style={{fontWeight: "bold"}}>{public_id}</span></p>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-4">
            <strong className="text-muted d-block mb-2">
              Bio
            </strong>
            <span>{bio}</span>
          </ListGroupItem>
        </ListGroup>
      </Card>
    )
  }
}



const mapStateToProps = (state) => ({
  user_id: state.userReducer.fullname,
  fullname: state.userReducer.fullname,
  bio: state.userReducer.bio,
  public_id: state.userReducer.public_id,
  photo: require("../../images/avatars/king.png")
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails)
