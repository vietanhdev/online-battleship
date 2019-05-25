import React from 'react';
import { withRouter } from "react-router";
import $ from 'jquery';
import MessageList from '../../components/messages/MessageList';
import Input from '../../components/messages/Input';

import { Card, CardHeader, CardBody } from "shards-react";
import { connect } from 'react-redux'

import { messageActions } from '../../redux/messages/actions'
import '../../components/messages/styles.scss';


class Messages extends React.Component {


    getFriendById = (id) => {

      console.log(this.props.friends)

      for (let friend in this.props.friends) {
        if (friend.public_id === id) {
          return friend;
        }
      }

      return null;

    }

    componentDidUpdate = () => {
      // Scroll to bottom of message list
      let objMessage = $('.messages');
      objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
    }

  
    componentDidMount = () => {
      this.props.fetchAllMessages(this.props.match.params.room_id);
      this.props.initSocket();
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

      return (

          <Card small className="mb-4">
              <CardHeader className="border-bottom">
              <h6> Message
              </h6>
              </CardHeader>
              <CardBody className="p-0 pb-3">
              <div className="app__content">
                  <div className="message_window">
                      <MessageList user_id={this.props.user.public_id} messages={this.props.messages}/>
                      <Input sendMessage={this.sendNewMessage.bind(this)}/>
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
  messages: state.messageReducer.messages
})

const mapDispatchToProps = {
  initSocket: messageActions.initSocket,
  fetchAllMessages: messageActions.fetchAllMessages,
  pushNewMessage: messageActions.pushNewMessage,
  sendMessage: messageActions.sendMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Messages))