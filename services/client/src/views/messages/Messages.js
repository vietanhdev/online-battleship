import React from 'react';
import { withRouter } from "react-router";
import MessageBox from '../../components/messages/Messages';

import { Container, Row, Col } from "shards-react";
import Friends from "../../components/friends/Friends"
import { connect } from 'react-redux'

import '../../components/messages/styles.scss';


class Messages extends React.Component {

    render () {
      return (
        <Container fluid className="main-content-container px-4 mt-4">
          <Row>
            <Col md="9">
              <Row>
                <Col>
                  <MessageBox roomId={this.props.match.params.room_id}></MessageBox>
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

})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Messages))