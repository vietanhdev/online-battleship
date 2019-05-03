import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'shards-react'

const online = require('../../images/friends/online.jpg')
const offline = require('../../images/friends/offline.jpg')

export class Friend extends Component {

  constructor (props) {
    super(props);

    this.state = {
      showActionButtons: false
    }
  }

  render() {
    const friend = this.props.data;
    return (
        <div onMouseEnter={() => this.setState({ showActionButtons: true })}
        onMouseLeave={() => this.setState({ showActionButtons: false })} style={{ borderBottom: "1px solid #ddd", height: "3rem", padding: "0.4rem", display: "flex", position: "relative"}}>
            <img alt={friend.image} style={{width: "2rem", height: "2rem" }} src={friend.image}></img>
            <p style={{fontSize: "1rem", lineHeight:" 2rem", marginLeft: "2rem"}} >{friend.name}</p>
            <div style={{ marginLeft: "1rem", display: this.state.showActionButtons ? "block" : "none"}}>
              <Button theme="light" size="sm" style={{ marginLeft: "0.1rem"}}>
                <i className="material-icons">mail</i>
              </Button>
              <Button theme="light" size="sm" style={{ marginLeft: "0.1rem"}}>
                Play Battleship
              </Button>
            </div>
            <img alt="status" src={friend.online? online : offline} style={{position: "absolute", top: "1rem", right: "1rem"}}></img>
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Friend)
