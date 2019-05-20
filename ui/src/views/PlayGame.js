
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import {Friends} from "../components/friends/Friends"

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router";

import { gameActions } from '../redux/games/actions'
import { appActions } from '../redux/app/actions'

export class PlayGame extends Component {

  constructor (props) {
    super(props);

    // Enter this room
    this.props.enterRoom(this.props.match.params.room_id, this.props.history);
  }

  render() {

    const { roomInfo } = this.props;

    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title={roomInfo.game.name} subtitle="Let's play" className="text-sm-left" />
        </Row>

      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  roomInfo: state.gameReducer.roomInfo
})

const mapDispatchToProps = {
  enterRoom: gameActions.enterRoom
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlayGame))
