import React, { Component } from 'react'
import { connect } from 'react-redux'

import loading_icon from '../../images/loading_ship.svg'
import styles from './Loading.scss';

export class Loading extends Component {
  render() {
    return (
      <div className={"loading-screen " + (this.props.isLoading ? "" : "hidden")}>
          <img alt="Loading Icon" src={loading_icon}></img>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.appReducer.isLoading
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading)
