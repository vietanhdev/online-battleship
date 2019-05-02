
import { Container, Row, Col, Card, CardHeader, CardBody, ListItem, Button } from "shards-react";

import PageTitle from "../components/common/PageTitle";

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { gameAction, gameActions } from '../redux/games/actions'

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
          <Col md="8">
            <Row>
              <Col>
                <Card small className="mb-4">
                  <CardHeader className="border-bottom">
                    <h6 className="m-0">Current Matches</h6>
                    <div style={{display: "flex", flexDirection: "row-reverse"}}>
                      <Button theme="accent" className="ml-2"><i class="material-icons">add_location</i> New Game</Button>
                      <Button theme="accent" className="ml-2" outline><i class="material-icons">compare_arrows</i> Quick match</Button>
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
                            First Name
                          </th>
                          <th scope="col" className="border-0">
                            Last Name
                          </th>
                          <th scope="col" className="border-0">
                            Country
                          </th>
                          <th scope="col" className="border-0">
                            City
                          </th>
                          <th scope="col" className="border-0">
                            Phone
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Ali</td>
                          <td>Kerry</td>
                          <td>Russian Federation</td>
                          <td>Gdańsk</td>
                          <td>107-0339</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Clark</td>
                          <td>Angela</td>
                          <td>Estonia</td>
                          <td>Borghetto di Vara</td>
                          <td>1-660-850-1647</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>Jerry</td>
                          <td>Nathan</td>
                          <td>Cyprus</td>
                          <td>Braunau am Inn</td>
                          <td>214-4225</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>Colt</td>
                          <td>Angela</td>
                          <td>Liberia</td>
                          <td>Bad Hersfeld</td>
                          <td>1-848-473-7416</td>
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
                      {gameList.map((game) =>
                        <li style={{listStyle: "none", marginLeft: "2rem"}}>

                          <div className="mb-3">
                                      <img
                                        className="rounded-circle"
                                        src={game.image}
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
          <Col md="4">
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Active Users</h6>
              </CardHeader>
              <CardBody className="p-0 pb-3">
                
              </CardBody>
            </Card>
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
