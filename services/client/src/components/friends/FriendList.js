import React, { Component } from 'react'
import { connect } from 'react-redux'

import Friend from './Friend'


import  { friendActions } from '../../redux/friends/actions'

export class FriendList extends Component {


  componentWillMount = () => {
    this.props.fetchFriendList();
  }

  render = () => {
    const friends = this.props.friends;
    return (
        <div className="m-2" style={{ overflow: "auto", maxHeight: "24rem"}}>
            {friends.map(function(friend, i){
               return <Friend data={friend} key={i}></Friend>
             })}
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  friends: state.friendReducer.friends
})

const mapDispatchToProps = {
  fetchFriendList: friendActions.fetchFriendList
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendList)
