
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import {Friends} from "../components/friends/Friends"

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router";

import { gameActions } from '../redux/games/actions'
import { appActions } from '../redux/app/actions'

import { requestStatus } from '../redux/services/http'

import Config from '../config'

import socketIOClient from "socket.io-client";

import { BattleShipGame } from '../components/games/battle_ship/BattleShipGame'

export class PlayGame extends Component {

  constructor (props) {
    super(props);

    this.state = {
      room_id: this.props.match.params.room_id
    }

    // Enter this room
    this.props.enterRoom(this.state.room_id, this.props.history);
  }

  componentDidMount() {

    const  { user, history } = this.props;

    const socket = socketIOClient(Config.GAME_ROOM_SOCKET_ENDPOINT);

    socket.on('connect', function(){
      console.log('SocketIO: Connected to server')
    });

    socket.on('disconnect', function(){
      console.log('SocketIO: Disconnected from server')
    });

    // Process login response
    socket.on('response_login_with_room', function(data){

      console.log(data)

      if (data.status !== requestStatus.SUCCESS) {
        gameActions.enterRoomFailed(history);
      } else {
        console.log('Authorized successfully.')
      }
      
    });

    // Login
    socket.emit('request_login_with_room', {
      'authorization': user.token,
      'room_public_id': this.state.room_id
    })

  }

  render() {

    const { roomInfo } = this.props;

    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={roomInfo.game.name} subtitle="Let's play" className="text-sm-left" />
        </Row>

        <BattleShipGame room={this.state.room_id} history={this.props.history}></BattleShipGame>

      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  roomInfo: state.gameReducer.roomInfo,
  user: state.userReducer
})

const mapDispatchToProps = {
  enterRoom: gameActions.enterRoom
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlayGame))
