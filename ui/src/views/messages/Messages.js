import React from 'react';
import { withRouter } from "react-router";
import $ from 'jquery';
import MessageBox from '../../components/messages/Messages';

import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Friends from "../../components/friends/Friends"
import { connect } from 'react-redux'

import Config from '../../config'
import request, { requestStatus } from '../../redux/services/http'

import { chatActions } from '../../redux/chat/actions'
import { notifierActions } from '../../redux/notifier/actions';

import '../../components/messages/styles.scss';


class Messages extends React.Component {

    render () {
      return (
        <Container fluid className="main-content-container px-4 mt-4">
          <Row>
            <Col md="9">
              <Row>
                <Col>
                  <MessageBox></MessageBox>
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


const mapStateToProps = (state) => {

}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Messages))