import React, { Component } from 'react'
import { connect } from 'react-redux'

import Friend from './Friend'


import  { friendActions } from '../../redux/friends/actions'

export class FriendList extends Component {


  componentWillMount = () => {
    this.props.fetchFriendList();
  }

  render = () => {
    const followings = this.props.followings;
    return (
        <div className="m-2" style={{ overflow: "auto", maxHeight: "24rem"}}>
            {followings.map(function(following, i){
               return <Friend data={following} key={i}></Friend>
             })}
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  followings: state.friendReducer.followings
})

const mapDispatchToProps = {
  fetchFriendList: friendActions.fetchFriendList
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendList)
