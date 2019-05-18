
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
    const {photo, fullname, bio} = this.props
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
          <Button pill outline size="sm" className="mb-2">
            <i className="material-icons mr-1">person_add</i> Follow
          </Button>
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
  fullname: state.userReducer.fullname,
  bio: state.userReducer.bio,
  photo: require("../../images/avatars/king.png")
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails)
