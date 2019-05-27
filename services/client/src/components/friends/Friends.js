import { Card, CardHeader, CardBody} from "shards-react";
import React, { Component } from 'react'
import { connect } from 'react-redux'

import FindUser from './FindUser'
import FriendList from './FriendList'

export class Friends extends Component {
  

  render() {
    return (
      <Card small className="mb-4" style={{maxWidth: "20rem", minWidth: "15rem", minHeight: "32rem"}}>
        <CardHeader className="border-bottom">
          <h6 className="m-0">Followings</h6>
        </CardHeader>
        <CardBody className="p-0 pb-3">
            <FindUser></FindUser>
            <FriendList></FriendList>
        </CardBody>
      </Card>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends)
