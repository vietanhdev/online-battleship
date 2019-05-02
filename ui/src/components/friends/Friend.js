import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Friend extends Component {

  render() {
    return (
        <div style={{ border: "1px solid #ddd", height: "3rem", padding: "0.4rem", display: "flex" }}>
            <img alt="Avatar" style={{width: "2rem", height: "2rem" }} src={require("../../images/avatars/king.png")}></img>
            <p style={{fontSize: "1rem", lineHeight:" 2rem", marginLeft: "2rem"}} >Viet Anh</p>
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Friend)
