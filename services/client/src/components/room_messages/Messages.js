import React from 'react';
import { withRouter } from "react-router";
import $ from 'jquery';
import MessageList from './MessageList';
import Input from './Input';

import { Card, CardHeader, CardBody } from "shards-react";
import { connect } from 'react-redux'

import { messageActions } from '../../redux/room_messages/actions'
import './styles.scss';


class Messages extends React.Component {

    componentDidUpdate = () => {
      // Scroll to bottom of message list
      let objMessage = $('.messages');
      objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
    }

  
    componentDidMount = () => {
      this.props.fetchAllMessages(this.props.match.params.room_id);
      this.props.initSocket(this.props.match.params.room_id);
    }

    componentWillReceiveProps = (nextProps) => {
      let nextRoomId = nextProps.roomId;
      if (this.roomId !== nextRoomId) {
        this.roomId = nextRoomId;
        this.props.fetchAllMessages(this.roomId);
      }
    }

    sendNewMessage(m) {
        if (m.value) {
          this.props.sendMessage(this.props.match.params.room_id, m.value);
          m.value = "";
        }
    }

    render () {

      let usersInRoom = this.props.usersInRoom;
      let listUsersInRoom = "";

      switch (usersInRoom.length) {
        case 0: break;
        case 1: listUsersInRoom = usersInRoom[0].fullname + " is in room."; break;
        case 2: listUsersInRoom = usersInRoom[0].fullname + " and " + usersInRoom[1].fullname + " are in room."; break 
        case 3: listUsersInRoom = usersInRoom[0].fullname + " and " + usersInRoom[1].fullname + " and 1 other person are in room."; break;
        default: listUsersInRoom = usersInRoom[0].fullname + " and " + usersInRoom[1].fullname + " and " + (usersInRoom.length - 2) + " others are in room."; break;
      }

      return (

          <Card small className="mb-4">
              <CardHeader className="border-bottom">
              <h6> Chat </h6>
              </CardHeader>
              <CardBody className="p-0 pb-3">
              <div className="app__content">
                  <div className="message_window">
                      <MessageList user_id={this.props.user.public_id} messages={this.props.messages}/>
                      <Input usersInRoom={listUsersInRoom} sendMessage={this.sendNewMessage.bind(this)}/>
                  </div>
              </div>
              </CardBody>
          </Card>
                
      )
    }
}


const mapStateToProps = (state) => ({
  user: state.userReducer,
  friends: state.friendReducer.friends,
  messages: state.roomMessageReducer.messages,
  usersInRoom: state.roomMessageReducer.users
})

const mapDispatchToProps = {
  initSocket: messageActions.initSocket,
  fetchAllMessages: messageActions.fetchAllMessages,
  pushNewMessage: messageActions.pushNewMessage,
  sendMessage: messageActions.sendMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Messages))