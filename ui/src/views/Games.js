
import { Container, Row, Col, Card, CardHeader, CardBody, ListItem, Button } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import {Friends} from "../components/friends/Friends"

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { gameActions } from '../redux/games/actions'

export class Games extends Component {

  constructor (props) {
    super(props);

    this.props.fetchGameList();

  }

  render() {

    const { gameList } = this.props;

    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Games" subtitle="Let's play with your friends!" className="text-sm-left" />
        </Row>

        <Row>
          <Col md="9">
            <Row>
              <Col>
                <Card small className="mb-4">
                  <CardHeader className="border-bottom">
                    <h6 className="m-0">Current Matches</h6>
                    <div style={{display: "flex", flexDirection: "row-reverse"}}>
                      <Button theme="accent" className="ml-2"><i className="material-icons">add_location</i> New Game</Button>
                      <Button theme="accent" className="ml-2" outline><i className="material-icons">compare_arrows</i> Quick match</Button>
                    </div>
                  </CardHeader>
                  <CardBody className="p-0 pb-3">
                    <table className="table mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th scope="col" className="border-0">
                            #
                          </th>
                          <th scope="col" className="border-0">
                            Game
                          </th>
                          <th scope="col" className="border-0">
                            # of players
                          </th>
                          <th scope="col" className="border-0">
                            Creator
                          </th>
                          <th scope="col" className="border-0">
                            Created time
                          </th>
                          <th scope="col" className="border-0">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Battle Ship</td>
                          <td>2</td>
                          <td>Viet Anh</td>
                          <td>9 minutes ago</td>
                          <td><Button theme="success" size="sm">Join</Button></td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Battle Ship</td>
                          <td>2</td>
                          <td>Viet Anh</td>
                          <td>9 minutes ago</td>
                          <td><Button theme="success" size="sm">Join</Button></td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Battle Ship</td>
                          <td>2</td>
                          <td>Viet Anh</td>
                          <td>9 minutes ago</td>
                          <td><Button theme="success" size="sm">Join</Button></td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Battle Ship</td>
                          <td>2</td>
                          <td>Viet Anh</td>
                          <td>9 minutes ago</td>
                          <td><Button theme="success" size="sm">Join</Button></td>
                        </tr>
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Card small className="mb-4">
                  <CardHeader className="border-bottom">
                    <h6 className="m-0">Avaiable Games</h6>
                  </CardHeader>
                  <CardBody className="p-0 pb-2">
                    <ul className="p-3" style={{display: "flex"}}>
                      {gameList.map((game, id) =>
                        <li style={{listStyle: "none", marginLeft: "2rem"}} key={id}>

                          <div className="mb-3">
                                      <img
                                        className="rounded-circle"
                                        src={require('../images/battleship.svg')}
                                        alt={game.name}
                                        width="55"
                                      />
                                    </div>
                        
                          {game.name}
                        
                        </li>
                      )}
                    </ul>
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
  gameList: state.gameReducer.gameList
})

const mapDispatchToProps = {
  fetchGameList: gameActions.fetchGameList
}

export default connect(mapStateToProps, mapDispatchToProps)(Games)
