
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

import loading_icon from '../images/loading_ship.svg'
import './loading.scss'

export class PlayGame extends Component {

  componentDidMount() {
    this.props.enterRoom(this.props.match.params.room_id, this.props.history);
  }

  render() {

    return (

      <Container fluid className="main-content-container px-4 mt-2">
      <div className={"loading-screen " + (this.props.displayLoading ? "" : "hidden")}>
        <img alt="Loading Icon" src={loading_icon}></img>
      </div>
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
  displayLoading: state.gameReducer.isLoading
})

const mapDispatchToProps = {
  openLoadingScreen: gameActions.openLoadingScreen,
  closeLoadingScreen: gameActions.closeLoadingScreen,
  enterRoom: gameActions.enterRoom
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlayGame))
