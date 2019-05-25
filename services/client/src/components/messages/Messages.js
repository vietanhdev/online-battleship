import React from 'react';
import { withRouter } from "react-router";
import $ from 'jquery';
import MessageList from '../../components/messages/MessageList';
import Input from '../../components/messages/Input';
import io from 'socket.io-client';

import { Card, CardHeader, CardBody } from "shards-react";
import { connect } from 'react-redux'

import Config from '../../config'
import { requestStatus } from '../../utilities/http'

import { messageActions } from '../../redux/messages/actions'
import '../../components/messages/styles.scss';


class Messages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            socket: null
        }
    }


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

      const  { user, history } = this.props;
      this.setState({
        ...this.state,
        socket: io(Config.message_SOCKET_ENDPOINT)
      }, () => {

        this.state.socket.on('connect', function(){
          console.log('SocketIO: Connected to server')
        });
    
        this.state.socket.on('disconnect', function(){
          console.log('SocketIO: Disconnected from server')
        });
    
        // Process login response
        this.state.socket.on('response_login', function(data){
    
          if (data.status !== requestStatus.SUCCESS) {
            messageActions.enterRoomFailed(history);
          } else {
            console.log('Authorized successfully.')
          }
          
        });
  
        this.state.socket.on('receive_message', (response) => {this.newMessage(response)});  
  
        // Login
        this.state.socket.emit('request_login', {
          'authorization': user.token
        })

      });  
  
  
    }

    componentWillReceiveProps = (nextProps) => {
      console.log(nextProps.roomId)
      let nextRoomId = nextProps.roomId;
      if (this.roomId !== nextRoomId) {
        this.roomId = nextRoomId;
        this.props.fetchAllMessages(this.roomId);
      }
    }

    newMessage = (m) => {
        this.props.pushNewMessage(m);
    }

    sendNewMessage(m) {
        if (m.value) {
          let msgContent =  {
            'receiver_public_id': this.props.match.params.room_id,
            'content': m.value
          };
          this.state.socket.emit("request_private_message", msgContent);
          m.value = "";
        }

    }

    render () {

      // let friend = this.getFriendById(this.props.match.params.room_id);
      console.log(this.props.messages)
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
  fetchAllMessages: messageActions.fetchAllMessages,
  pushNewMessage: messageActions.pushNewMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Messages))