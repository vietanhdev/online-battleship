
import { Container, Row, Col } from "shards-react";

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router";

import { gameActions } from '../redux/games/actions'
// import { appActions } from '../redux/app/actions'

import { requestStatus } from '../utilities/http'

import Config from '../config'

import socketIOClient from "socket.io-client";

import { BattleShipGame } from '../components/games/battle_ship/BattleShipGame'
import Messages from "../components/room_messages/Messages"

export class PlayGame extends Component {

  render() {

    return (

      <Container fluid className="main-content-container px-4 mt-2">
      <Row>
          <Col md="8">
          <Row>
              <Col>
              <BattleShipGame room={this.props.match.params.room_id} history={this.props.history}></BattleShipGame>
              </Col>
          </Row>
          </Col>
          <Col md="4">
              <Messages></Messages>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlayGame))
