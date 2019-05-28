import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import Friends from "../components/friends/Friends"

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router";
import { Link } from 'react-router-dom'

import { gameActions } from '../redux/games/actions'
import { appActions } from '../redux/app/actions'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

export class Games extends Component {

  constructor (props) {
    super(props);

    this.props.fetchGameList();

  }

  render() {

    const { gameList, roomList } = this.props;

    TimeAgo.addLocale(en);

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
                      <Button onClick={() => {this.props.createRoom("battle_ship", this.props.history)}} theme="accent" className="ml-2"><i className="material-icons">add_location</i> New Game</Button>
                      {/* <Button theme="accent" className="ml-2" outline><i className="material-icons">compare_arrows</i> Quick match</Button> */}
                    </div>
                  </CardHeader>
                  <CardBody className="p-0 pb-3" style={{maxHeight: "25rem", overflow: "auto"}}>
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
                            Status
                          </th>
                          <th scope="col" className="border-0">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>

                        {
                          roomList.map((room , index) => {

                            let gameName = room.game.name;
                            // let gameId = room.public_id;
                            let numOfPlayers = room.players.length;

                            // Generate created time in ago format
                            const timeAgo = new TimeAgo('en-US')
                            let createdTime = timeAgo.format(new Date(room.created_at * 1000));


                            let creator = {
                              fullname: "",
                              public_id: ""
                            };

                            for (let i = 0; i < room.players.length; ++i) {
                              let player = room.players[i];
                              if (player.creator) {
                                  creator = {
                                    fullname: player.username,
                                    public_id: player.public_id
                                  };
                                  break;
                              }
                            }
                            

                            return (
                            <tr key={index}>
                              <td>{index}</td>
                              <td>{gameName}</td>
                              <td>{numOfPlayers}</td>
                              <td>{creator.fullname}</td>
                              <td>{createdTime}</td>
                              <td>{room.finished ? "Finished" : (room.enough_players ? "Playing" : "Waiting")}</td>
                              <td><Link to={"/games/" + room.game.public_id + "/" + room.room_public_id}><Button theme="success" size="sm">{room.enough_players ? "View" : "Join"}</Button></Link></td>
                            </tr>)
                          })
                        }
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


  componentDidMount = () => {
    this.props.fetchRoomList();
    this.interval = setInterval(() => {
      this.props.fetchRoomList();
    }, 5000);
  }


  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

}



const mapStateToProps = (state) => ({
  gameList: state.gameReducer.gameList,
  roomList: state.gameReducer.roomList
})

const mapDispatchToProps = {
  fetchGameList: gameActions.fetchGameList,
  openLoadingScreen: appActions.openLoadingScreen,
  closeLoadingScreen: appActions.closeLoadingScreen,
  createRoom : gameActions.createRoom,
  fetchRoomList: gameActions.fetchRoomList
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Games))