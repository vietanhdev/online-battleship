import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Card, CardHeader, CardBody, Button } from "shards-react";

import Images from './Images'

import {ShipSize, BoardState} from '../../../redux/battleship/constants'

import './files/styles.scss'
import { battleshipActions } from '../../../redux/battleship';

import { withRouter } from "react-router";

import Utilities from '../../../redux/battleship/utilities'

export class BattleShipGame extends Component {


    componentDidMount = () => {
        this.props.initSocket(this.props.match.params.room_id);
    }


    clickBoard = (x, y, board) => {

        // If game over, prevent clicking the board
        if (this.props.gameState.gameOver) return;

        const isMyTurn = this.props.gameState.isMyTurn;
        const gameState = this.props.gameState;
        const isArranging = gameState.isMyRoom && !gameState.player1.shipsReady;

        if (isArranging && board === 1) { // Click on board 1 in arranging mode

            // Put a ship in board
            this.props.putShip(x, y);

        } else if (isMyTurn && board === 2) {

            // Fire
            this.props.fire(x, y);

        }

    }


    createBoard = (height, width, data, ships, board) => {
        let table = []
    
        // Outer loop to create parent row
        for (let y = 0; y < height; y++) {
            let children = []

            // Inner loop to create cols
            for (let x = 0; x < width; x++) {

                // Check for ships
                let shipClasses = ""; // style classes for ship
                for (let i = 0; i < ships.length; ++i) {
                    if (ships[i].x === x && ships[i].y === y) {
                        switch (ships[i].size) {
                            case ShipSize.GIANT: shipClasses += " ship-4"; break
                            case ShipSize.LARGE: shipClasses += " ship-3"; break
                            case ShipSize.MID: shipClasses += " ship-2"; break
                            default: shipClasses += " ship-1";
                        }

                        if (ships[i].vertical) shipClasses += " ship-ver";
                    }
                }

                // Check cell state
                switch (data[y][x]) {
                    case BoardState.MISS: shipClasses += " shot-miss"; break;
                    case BoardState.DESTROYED:
                    case BoardState.HIT: shipClasses += " shot-hit"; break;
                    default: 
                }

                children.push(<div key={x} className={"game_grid-cell" + shipClasses} onClick={() => {this.clickBoard(x, y, board)}}></div>)
            }

            //Create the parent and add the children
            table.push(<div key={y} className="game_grid-row"><div key={-1} className="game_grid-nav">{y}</div>{children}</div>)

        }
        return table;
    }

    render() {

        
        const selectShipSize = this.props.shipArrangement.selectedShipSize
        const player1 = this.props.gameState.player1;
        const player2 = this.props.gameState.player2;
        const gameState = this.props.gameState;
        const maxNumberOfShips = gameState.maxNumberOfShips;
        let ships = gameState.player1.ships;
        const gameOver = this.props.gameState.gameOver;
        const winner = this.props.winnerId === player1.playerPublicId ? player1 : player2; // Only use if game Over

        const showArrangementScreen = gameState.isMyRoom && !player1.shipsReady; // Show arrangment or not. Only show it if this is user's room and ships have not been arranged

        let remainingSmallShips = maxNumberOfShips[ShipSize.SMALL] - Utilities.countShip(ships, ShipSize.SMALL);
        let remainingMidShips = maxNumberOfShips[ShipSize.MID] - Utilities.countShip(ships, ShipSize.MID);
        let remainingLargeShips = maxNumberOfShips[ShipSize.LARGE] - Utilities.countShip(ships, ShipSize.LARGE);
        let remainingGiantShips = maxNumberOfShips[ShipSize.GIANT] - Utilities.countShip(ships, ShipSize.GIANT);


        let notification = "";
        if (gameOver) {
            notification = "Game Over! Winner: Captain " + winner.fullname;
        } else if (showArrangementScreen) {
            notification = "Place your fleet on the field";
        } else if (!gameState.isEnoughPlayer) {
            notification = "Waiting for your component...";
        } else if (!player2.shipsReady) {
            notification = "Waiting for your component to arrange fleets";
        } else {
            notification = "This turn: Captain " + gameState.turn.fullname;
        }

        return (

            <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h4 className="text-center">BattleShip</h4>
                            <h5 className="text-center">Captain [{player1.fullname}] <span style={{fontWeight: "bold"}}>VS.</span> Captain [{player2.fullname !== "" ? player2.fullname : "  . . . "}]</h5>
                        </CardHeader>
                        <CardBody className="p-0 pb-3">
                        <div className="battleship_game_wrapper">
                            <div className="extension_wrapper theme-white">

                                <header className="header">
                                
                                <p className="header-title">{notification}</p>
                                </header>

                                <main className="game_wrapper">

                                <div className="col">
                                    <div className="game_field">
                                    <p className="game_field-title">{gameState.isMyRoom ? "My fleets" : player1.fullname}</p>

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

                                        {this.createBoard(gameState.boardHeight, gameState.boardWidth, player1.data, player1.ships, 1)}
                                
                                    </div>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="game_field">
                                        <p className="game_field-title">{showArrangementScreen ?  "Ship Arrangement" : ( gameState.isMyRoom ? "Opponent's fleets" : player2.fullname)}</p>
                                        <div className={"game_grid game_grid-opponent " + (showArrangementScreen ? " hidden" : "")}>
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

                                            {this.createBoard(gameState.boardHeight, gameState.boardWidth, player2.data, player2.ships, 2)}
                                            
                                        </div>
                                        <div className={"prepare_field" + (this.props.shipArrangement.vertical ? " prepare_field--rotate" : "") + (showArrangementScreen ? "" : " hidden")}>

                                            <div className="prepare_cell-wrapper">
                                                <div className={"prepare_cell" + (selectShipSize === ShipSize.SMALL ? " prepare_cell--active" : "") + (remainingSmallShips === 0 ? " prepare_cell--mute": "")} onClick={() => {this.props.selectShipSize(ShipSize.SMALL)}}>
                                                    <div className="prepare_cell-counter">x{remainingSmallShips}</div>
                                                    <img src={Images.ship_1_player} alt=""
                                                    className="prepare_cell-ship"></img>
                                                </div>

                                                <div className={"prepare_cell" + (selectShipSize === ShipSize.MID ? " prepare_cell--active" : "") + (remainingMidShips === 0 ? " prepare_cell--mute": "")} onClick={() => {this.props.selectShipSize(ShipSize.MID)}}>
                                                    <div className="prepare_cell-counter">x{remainingMidShips}</div>
                                                    <img src={Images.ship_2_player} alt=""
                                                    className="prepare_cell-ship"></img>
                                                </div>

                                                <div className={"prepare_cell" + (selectShipSize === ShipSize.LARGE ? " prepare_cell--active" : "") + (remainingLargeShips === 0 ? " prepare_cell--mute": "")} onClick={() => {this.props.selectShipSize(ShipSize.LARGE)}}>
                                                <div className="prepare_cell-counter">x{remainingLargeShips}</div>
                                                    <img src={Images.ship_3_player} alt="" className="prepare_cell-ship"></img>
                                                </div>

                                                <div className={"prepare_cell" + (selectShipSize === ShipSize.GIANT ? " prepare_cell--active" : "") + (remainingGiantShips === 0 ? " prepare_cell--mute": "")} onClick={() => {this.props.selectShipSize(ShipSize.GIANT)}}>
                                                <div className="prepare_cell-counter">x{remainingGiantShips}</div>
                                                    <img src={Images.ship_4_player} alt=""
                                                    className="prepare_cell-ship"></img>
                                                </div>

                                                <button className="prepare_field-rotate_btn" onClick={this.props.toggleShipRotate}></button>
                                            </div>

                                            <div className="prepare_overlay">
                                            <p className="prepare_overlay-text">You are completely ready to sea battle! Starting, Captain?</p>
                                            <p className="prepare_overlay-text--small">Or do you want to change arrangement of ships?</p>
                                            </div>

                                            <div className="prepare_field-buttons">
                                            <Button theme="warning" id="auto" onClick={this.props.clearArrangement}> Clear All </Button>
                                            <Button theme="danger"
                                                id="start" onClick={this.props.submitShips}>TO BATTLE!</Button>
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
    user: state.userReducer,
    shipArrangement: state.battleshipReducer.shipArrangement,
    gameState: state.battleshipReducer.gameState
})

const mapDispatchToProps = {
    toggleShipRotate: battleshipActions.toggleShipRotate,
    selectShipSize: battleshipActions.selectShipSize,
    initSocket: battleshipActions.initSocket,
    putShip: battleshipActions.putShip,
    clearArrangement: battleshipActions.clearArrangement,
    submitShips: battleshipActions.submitShips,
    fire: battleshipActions.fire,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BattleShipGame))
