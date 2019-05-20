
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import {Friends} from "../components/friends/Friends"

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { gameActions } from '../redux/games/actions'
import { appActions } from '../redux/app/actions'

export class PlayGame extends Component {

  constructor (props) {
    super(props);

  }

  render() {

    const { gameList } = this.props;

    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="PlayGame" subtitle="Let's play with your friends!" className="text-sm-left" />
        </Row>


      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayGame)
