import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";

import Images from './Images'
import Constants from './constants';


import './files/styles.scss'

export class BattleShipGame extends Component {


    constructor(props) {

        super(props);

        this.state = {

            ship_arrangement: {
                rotate_ship: false,
                selected_ship_type: Constants.SHIP_SIZE.GIGANT
            }

        }

    }


    toggleRotateShip = () =>  {

        let newState = Object.assign({}, this.state);
        newState.ship_arrangement.rotate_ship = !this.state.ship_arrangement.rotate_ship;

        this.setState(newState);
    }


    selectShipSize = (size) => {
        let newState = Object.assign({}, this.state);
        newState.ship_arrangement.selected_ship_type = size;

        this.setState(newState);
    }

    render() {
        return (

            <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h4 className="text-center">BattleShip</h4>
                        </CardHeader>
                        <CardBody className="p-0 pb-3">
                        <div className="battleship_game_wrapper">
                            <div className="extension_wrapper theme-white">

                                <header className="header">
                                <p className="header-title">Place your fleet on the field</p>
                                </header>

                                <main className="game_wrapper">

                                <div className="col">
                                    <div className="game_field">
                                    <p className="game_field-title">My fleets</p>

                                    <div className="game_grid game_grid-player">
                                        <div className="game_grid-row">
                                            <div className="game_grid-corner"></div>
                                            <div className="game_grid-nav">A</div>
                                            <div className="game_grid-nav">B</div>
                                            <div className="game_grid-nav">C</div>
                                            <div className="game_grid-nav">D</div>
                                            <div className="game_grid-nav">E</div>
                                            <div className="game_grid-nav">F</div>
                                            <div className="game_grid-nav">G</div>
                                            <div className="game_grid-nav">H</div>
                                            <div className="game_grid-nav">I</div>
                                            <div className="game_grid-nav">J</div>
                                        </div>
                                        <div className="game_grid-row">
                                            <div className="game_grid-nav">1</div>
                                            <div className="game_grid-cell" id="c0_0"></div>
                                            <div className="game_grid-cell" id="c0_1"></div>
                                            <div className="game_grid-cell" id="c0_2"></div>
                                            <div className="game_grid-cell" id="c0_3"></div>
                                            <div className="game_grid-cell" id="c0_4"></div>
                                            <div className="game_grid-cell" id="c0_5"></div>
                                            <div className="game_grid-cell" id="c0_6"></div>
                                            <div className="game_grid-cell" id="c0_7"></div>
                                            <div className="game_grid-cell" id="c0_8"></div>
                                            <div className="game_grid-cell" id="c0_9"></div>
                                        </div>
                                        <div className="game_grid-row">
                                            <div className="game_grid-nav">2</div>
                                            <div className="game_grid-cell" id="c1_0"></div>
                                            <div className="game_grid-cell" id="c1_1"></div>
                                            <div className="game_grid-cell" id="c1_2"></div>
                                            <div className="game_grid-cell" id="c1_3"></div>
                                            <div className="game_grid-cell" id="c1_4"></div>
                                            <div className="game_grid-cell" id="c1_5"></div>
                                            <div className="game_grid-cell" id="c1_6"></div>
                                            <div className="game_grid-cell" id="c1_7"></div>
                                            <div className="game_grid-cell" id="c1_8"></div>
                                            <div className="game_grid-cell" id="c1_9"></div>
                                        </div>
                                        <div className="game_grid-row">
                                            <div className="game_grid-nav">3</div>
                                            <div className="game_grid-cell" id="c2_0"></div>
                                            <div className="game_grid-cell" id="c2_1"></div>
                                            <div className="game_grid-cell" id="c2_2"></div>
                                            <div className="game_grid-cell" id="c2_3"></div>
                                            <div className="game_grid-cell" id="c2_4"></div>
                                            <div className="game_grid-cell" id="c2_5"></div>
                                            <div className="game_grid-cell" id="c2_6"></div>
                                            <div className="game_grid-cell" id="c2_7"></div>
                                            <div className="game_grid-cell" id="c2_8"></div>
                                            <div className="game_grid-cell" id="c2_9"></div>
                                        </div>
                                        <div className="game_grid-row">
                                            <div className="game_grid-nav">4</div>
                                            <div className="game_grid-cell" id="c3_0"></div>
                                            <div className="game_grid-cell" id="c3_1"></div>
                                            <div className="game_grid-cell" id="c3_2"></div>
                                            <div className="game_grid-cell" id="c3_3"></div>
                                            <div className="game_grid-cell" id="c3_4"></div>
                                            <div className="game_grid-cell" id="c3_5"></div>
                                            <div className="game_grid-cell" id="c3_6"></div>
                                            <div className="game_grid-cell" id="c3_7"></div>
                                            <div className="game_grid-cell" id="c3_8"></div>
                                            <div className="game_grid-cell" id="c3_9"></div>
                                        </div>
                                        <div className="game_grid-row">
                                            <div className="game_grid-nav">5</div>
                                            <div className="game_grid-cell" id="c4_0"></div>
                                            <div className="game_grid-cell" id="c4_1"></div>
                                            <div className="game_grid-cell" id="c4_2"></div>
                                            <div className="game_grid-cell" id="c4_3"></div>
                                            <div className="game_grid-cell" id="c4_4"></div>
                                            <div className="game_grid-cell" id="c4_5"></div>
                                            <div className="game_grid-cell" id="c4_6"></div>
                                            <div className="game_grid-cell" id="c4_7"></div>
                                            <div className="game_grid-cell" id="c4_8"></div>
                                            <div className="game_grid-cell" id="c4_9"></div>
                                        </div>
                                            <div className="game_grid-row">
                                            <div className="game_grid-nav">6</div>
                                            <div className="game_grid-cell" id="c5_0"></div>
                                            <div className="game_grid-cell" id="c5_1"></div>
                                            <div className="game_grid-cell" id="c5_2"></div>
                                            <div className="game_grid-cell" id="c5_3"></div>
                                            <div className="game_grid-cell" id="c5_4"></div>
                                            <div className="game_grid-cell" id="c5_5"></div>
                                            <div className="game_grid-cell" id="c5_6"></div>
                                            <div className="game_grid-cell" id="c5_7"></div>
                                            <div className="game_grid-cell" id="c5_8"></div>
                                            <div className="game_grid-cell" id="c5_9"></div>
                                        </div>
                                        <div className="game_grid-row">
                                            <div className="game_grid-nav">7</div>
                                            <div className="game_grid-cell" id="c6_0"></div>
                                            <div className="game_grid-cell" id="c6_1"></div>
                                            <div className="game_grid-cell" id="c6_2"></div>
                                            <div className="game_grid-cell" id="c6_3"></div>
                                            <div className="game_grid-cell" id="c6_4"></div>
                                            <div className="game_grid-cell" id="c6_5"></div>
                                            <div className="game_grid-cell" id="c6_6"></div>
                                            <div className="game_grid-cell" id="c6_7"></div>
                                            <div className="game_grid-cell" id="c6_8"></div>
                                            <div className="game_grid-cell" id="c6_9"></div>
                                        </div>
                                        <div className="game_grid-row">
                                            <div className="game_grid-nav">8</div>
                                            <div className="game_grid-cell" id="c7_0"></div>
                                            <div className="game_grid-cell" id="c7_1"></div>
                                            <div className="game_grid-cell" id="c7_2"></div>
                                            <div className="game_grid-cell" id="c7_3"></div>
                                            <div className="game_grid-cell" id="c7_4"></div>
                                            <div className="game_grid-cell" id="c7_5"></div>
                                            <div className="game_grid-cell" id="c7_6"></div>
                                            <div className="game_grid-cell" id="c7_7"></div>
                                            <div className="game_grid-cell" id="c7_8"></div>
                                            <div className="game_grid-cell" id="c7_9"></div>
                                        </div>
                                        <div className="game_grid-row">
                                            <div className="game_grid-nav">9</div>
                                            <div className="game_grid-cell" id="c8_0"></div>
                                            <div className="game_grid-cell" id="c8_1"></div>
                                            <div className="game_grid-cell" id="c8_2"></div>
                                            <div className="game_grid-cell" id="c8_3"></div>
                                            <div className="game_grid-cell" id="c8_4"></div>
                                            <div className="game_grid-cell" id="c8_5"></div>
                                            <div className="game_grid-cell" id="c8_6"></div>
                                            <div className="game_grid-cell" id="c8_7"></div>
                                            <div className="game_grid-cell" id="c8_8"></div>
                                            <div className="game_grid-cell" id="c8_9"></div>
                                        </div>
                                        <div className="game_grid-row">
                                            <div className="game_grid-nav">10</div>
                                            <div className="game_grid-cell" id="c9_0"></div>
                                            <div className="game_grid-cell" id="c9_1"></div>
                                            <div className="game_grid-cell" id="c9_2"></div>
                                            <div className="game_grid-cell" id="c9_3"></div>
                                            <div className="game_grid-cell" id="c9_4"></div>
                                            <div className="game_grid-cell" id="c9_5"></div>
                                            <div className="game_grid-cell" id="c9_6"></div>
                                            <div className="game_grid-cell" id="c9_7"></div>
                                            <div className="game_grid-cell" id="c9_8"></div>
                                            <div className="game_grid-cell" id="c9_9"></div>
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="game_field">
                                        <p className="game_field-title">Ship Arrangement</p>
                                        <div className="game_grid game_grid-opponent hidden">
                                            <div className="game_grid-row">
                                                <div className="game_grid-corner"></div>
                                                <div className="game_grid-nav">A</div>
                                                <div className="game_grid-nav">B</div>
                                                <div className="game_grid-nav">C</div>
                                                <div className="game_grid-nav">D</div>
                                                <div className="game_grid-nav">E</div>
                                                <div className="game_grid-nav">F</div>
                                                <div className="game_grid-nav">G</div>
                                                <div className="game_grid-nav">H</div>
                                                <div className="game_grid-nav">I</div>
                                                <div className="game_grid-nav">J</div>
                                            </div>
                                            <div className="game_grid-row">
                                                <div className="game_grid-nav">1</div>
                                                <div className="game_grid-cell" id="o0_0"></div>
                                                <div className="game_grid-cell" id="o0_1"></div>
                                                <div className="game_grid-cell" id="o0_2"></div>
                                                <div className="game_grid-cell" id="o0_3"></div>
                                                <div className="game_grid-cell" id="o0_4"></div>
                                                <div className="game_grid-cell" id="o0_5"></div>
                                                <div className="game_grid-cell" id="o0_6"></div>
                                                <div className="game_grid-cell" id="o0_7"></div>
                                                <div className="game_grid-cell" id="o0_8"></div>
                                                <div className="game_grid-cell" id="o0_9"></div>
                                            </div>
                                            <div className="game_grid-row">
                                                <div className="game_grid-nav">2</div>
                                                <div className="game_grid-cell" id="o1_0"></div>
                                                <div className="game_grid-cell" id="o1_1"></div>
                                                <div className="game_grid-cell" id="o1_2"></div>
                                                <div className="game_grid-cell" id="o1_3"></div>
                                                <div className="game_grid-cell" id="o1_4"></div>
                                                <div className="game_grid-cell" id="o1_5"></div>
                                                <div className="game_grid-cell" id="o1_6"></div>
                                                <div className="game_grid-cell" id="o1_7"></div>
                                                <div className="game_grid-cell" id="o1_8"></div>
                                                <div className="game_grid-cell" id="o1_9"></div>
                                            </div>
                                            <div className="game_grid-row">
                                                <div className="game_grid-nav">3</div>
                                                <div className="game_grid-cell" id="o2_0"></div>
                                                <div className="game_grid-cell" id="o2_1"></div>
                                                <div className="game_grid-cell" id="o2_2"></div>
                                                <div className="game_grid-cell" id="o2_3"></div>
                                                <div className="game_grid-cell" id="o2_4"></div>
                                                <div className="game_grid-cell" id="o2_5"></div>
                                                <div className="game_grid-cell" id="o2_6"></div>
                                                <div className="game_grid-cell" id="o2_7"></div>
                                                <div className="game_grid-cell" id="o2_8"></div>
                                                <div className="game_grid-cell" id="o2_9"></div>
                                            </div>
                                            <div className="game_grid-row">
                                                <div className="game_grid-nav">4</div>
                                                <div className="game_grid-cell" id="o3_0"></div>
                                                <div className="game_grid-cell" id="o3_1"></div>
                                                <div className="game_grid-cell" id="o3_2"></div>
                                                <div className="game_grid-cell" id="o3_3"></div>
                                                <div className="game_grid-cell" id="o3_4"></div>
                                                <div className="game_grid-cell" id="o3_5"></div>
                                                <div className="game_grid-cell" id="o3_6"></div>
                                                <div className="game_grid-cell" id="o3_7"></div>
                                                <div className="game_grid-cell" id="o3_8"></div>
                                                <div className="game_grid-cell" id="o3_9"></div>
                                            </div>
                                            <div className="game_grid-row">
                                                <div className="game_grid-nav">5</div>
                                                <div className="game_grid-cell" id="o4_0"></div>
                                                <div className="game_grid-cell" id="o4_1"></div>
                                                <div className="game_grid-cell" id="o4_2"></div>
                                                <div className="game_grid-cell" id="o4_3"></div>
                                                <div className="game_grid-cell" id="o4_4"></div>
                                                <div className="game_grid-cell" id="o4_5"></div>
                                                <div className="game_grid-cell" id="o4_6"></div>
                                                <div className="game_grid-cell" id="o4_7"></div>
                                                <div className="game_grid-cell" id="o4_8"></div>
                                                <div className="game_grid-cell" id="o4_9"></div>
                                            </div>
                                            <div className="game_grid-row">
                                                <div className="game_grid-nav">6</div>
                                                <div className="game_grid-cell" id="o5_0"></div>
                                                <div className="game_grid-cell" id="o5_1"></div>
                                                <div className="game_grid-cell" id="o5_2"></div>
                                                <div className="game_grid-cell" id="o5_3"></div>
                                                <div className="game_grid-cell" id="o5_4"></div>
                                                <div className="game_grid-cell" id="o5_5"></div>
                                                <div className="game_grid-cell" id="o5_6"></div>
                                                <div className="game_grid-cell" id="o5_7"></div>
                                                <div className="game_grid-cell" id="o5_8"></div>
                                                <div className="game_grid-cell" id="o5_9"></div>
                                            </div>
                                            <div className="game_grid-row">
                                                <div className="game_grid-nav">7</div>
                                                <div className="game_grid-cell" id="o6_0"></div>
                                                <div className="game_grid-cell" id="o6_1"></div>
                                                <div className="game_grid-cell" id="o6_2"></div>
                                                <div className="game_grid-cell" id="o6_3"></div>
                                                <div className="game_grid-cell" id="o6_4"></div>
                                                <div className="game_grid-cell" id="o6_5"></div>
                                                <div className="game_grid-cell" id="o6_6"></div>
                                                <div className="game_grid-cell" id="o6_7"></div>
                                                <div className="game_grid-cell" id="o6_8"></div>
                                                <div className="game_grid-cell" id="o6_9"></div>
                                            </div>
                                            <div className="game_grid-row">
                                                <div className="game_grid-nav">8</div>
                                                <div className="game_grid-cell" id="o7_0"></div>
                                                <div className="game_grid-cell" id="o7_1"></div>
                                                <div className="game_grid-cell" id="o7_2"></div>
                                                <div className="game_grid-cell" id="o7_3"></div>
                                                <div className="game_grid-cell" id="o7_4"></div>
                                                <div className="game_grid-cell" id="o7_5"></div>
                                                <div className="game_grid-cell" id="o7_6"></div>
                                                <div className="game_grid-cell" id="o7_7"></div>
                                                <div className="game_grid-cell" id="o7_8"></div>
                                                <div className="game_grid-cell" id="o7_9"></div>
                                            </div>
                                            <div className="game_grid-row">
                                                <div className="game_grid-nav">9</div>
                                                <div className="game_grid-cell" id="o8_0"></div>
                                                <div className="game_grid-cell" id="o8_1"></div>
                                                <div className="game_grid-cell" id="o8_2"></div>
                                                <div className="game_grid-cell" id="o8_3"></div>
                                                <div className="game_grid-cell" id="o8_4"></div>
                                                <div className="game_grid-cell" id="o8_5"></div>
                                                <div className="game_grid-cell" id="o8_6"></div>
                                                <div className="game_grid-cell" id="o8_7"></div>
                                                <div className="game_grid-cell" id="o8_8"></div>
                                                <div className="game_grid-cell" id="o8_9"></div>
                                            </div>
                                            <div className="game_grid-row">
                                                <div className="game_grid-nav">10</div>
                                                <div className="game_grid-cell" id="o9_0"></div>
                                                <div className="game_grid-cell" id="o9_1"></div>
                                                <div className="game_grid-cell" id="o9_2"></div>
                                                <div className="game_grid-cell" id="o9_3"></div>
                                                <div className="game_grid-cell" id="o9_4"></div>
                                                <div className="game_grid-cell" id="o9_5"></div>
                                                <div className="game_grid-cell" id="o9_6"></div>
                                                <div className="game_grid-cell" id="o9_7"></div>
                                                <div className="game_grid-cell" id="o9_8"></div>
                                                <div className="game_grid-cell" id="o9_9"></div>
                                            </div>
                                        </div>
                                        <div className={ this.state.ship_arrangement.rotate_ship ? "prepare_field--rotate" : "prepare_field"}>

                                            <div className="prepare_cell-wrapper">
                                                <div className={"prepare_cell" + (this.state.ship_arrangement.selected_ship_type === Constants.SHIP_SIZE.SMALL ? " prepare_cell--active" : "")} onClick={() => {this.selectShipSize(Constants.SHIP_SIZE.SMALL)}}>
                                                    <div className="prepare_cell-counter">x4</div>
                                                    <img src={Images.ship_1_player} alt=""
                                                    className="prepare_cell-ship"></img>
                                                </div>

                                                <div className={"prepare_cell" + (this.state.ship_arrangement.selected_ship_type === Constants.SHIP_SIZE.MID ? " prepare_cell--active" : "")} onClick={() => {this.selectShipSize(Constants.SHIP_SIZE.MID)}}>
                                                    <div className="prepare_cell-counter">x3</div>
                                                    <img src={Images.ship_2_player} alt=""
                                                    className="prepare_cell-ship"></img>
                                                </div>

                                                <div className={"prepare_cell" + (this.state.ship_arrangement.selected_ship_type === Constants.SHIP_SIZE.LARGE ? " prepare_cell--active" : "")} onClick={() => {this.selectShipSize(Constants.SHIP_SIZE.LARGE)}}>
                                                <div className="prepare_cell-counter">x2</div>
                                                    <img src={Images.ship_3_player} alt="" className="prepare_cell-ship"></img>
                                                </div>

                                                <div className={"prepare_cell" + (this.state.ship_arrangement.selected_ship_type === Constants.SHIP_SIZE.GIGANT ? " prepare_cell--active" : "")} onClick={() => {this.selectShipSize(Constants.SHIP_SIZE.GIGANT)}}>
                                                <div className="prepare_cell-counter">x1</div>
                                                    <img src={Images.ship_4_player} alt=""
                                                    className="prepare_cell-ship"></img>
                                                </div>

                                                <button className="prepare_field-rotate_btn" onClick={this.toggleRotateShip}></button>
                                            </div>

                                            <div className="prepare_overlay">
                                            <p className="prepare_overlay-text">You are completely ready to sea battle! Starting, Captain?</p>
                                            <p className="prepare_overlay-text--small">Or do you want to change arrangement of ships?</p>
                                            </div>

                                            <div className="prepare_field-buttons">
                                            <Button theme="light" id="auto"> Random arrangement</Button>
                                            <Button theme="warning"
                                                id="start">TO BATTLE!</Button>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="overlay">
                                    <div className="overlay-text">Do you really want to start a new game?
                                    </div>
                                    <div className="overlay-btn_wrap">
                                    <button
                                        className="btn btn-white overlay-btn overlay-btn--yes">Yes</button>
                                    <button
                                        className="btn btn-white overlay-btn overlay-btn--no">No</button>
                                    </div>

                                </div>

                                </main>

                            </div>
                        </div>
                        </CardBody>
                    </Card>
        )
    }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(BattleShipGame)
