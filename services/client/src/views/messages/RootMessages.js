import React from 'react';
import { withRouter } from "react-router";

import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import Friends from "../../components/friends/Friends"
import { connect } from 'react-redux'

import '../../components/private_messages/styles.scss';

class Messages extends React.Component {
  
   
    render () {

        const  { followings } = this.props;
        // Show message box of the first friend in friend list
        // If friend list is not empty
        if (followings.length !== 0) {
          this.props.history.push("/messages/" + followings[0].public_id);
        }

        return (

          <Container fluid className="main-content-container px-4 mt-4">
            <Row>
              <Col md="9">
                <Row>
                  <Col>
                    <Card small className="mb-4">
                      <CardHeader className="border-bottom">
                        <h4 className="m-0">Messages</h4>
                      </CardHeader>
                      <CardBody className="p-0 pb-3" style={{minHeight: "30rem", maxHeight: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <div style={{fontSize: "1.5rem", color: "#999"}}>Please follow a friend to begin.</div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col md="3">
                <Friends></Friends>
              </Col>
            </Row>

          </Container>
        )
    }
}


const mapStateToProps = (state) => ({
  followings: state.friendReducer.followings
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Messages))