import React from 'react';
import { withRouter } from "react-router";
import $ from 'jquery';
import MessageList from '../../components/messages/MessageList';
import Input from '../../components/messages/Input';
import io from 'socket.io-client';

import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Friends from "../../components/friends/Friends"
import { connect } from 'react-redux'

import Config from '../../config'
import request, { requestStatus } from '../../redux/services/http'

import { chatActions } from '../../redux/chat/actions'
import { notifierActions } from '../../redux/notifier/actions';

import '../../components/messages/styles.scss';


class Messages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            socket: null,
        }
    }


    fetchAllMessages = (roomId) => {

      // Load old messages
        request.get("/messages/"+roomId+"?offset=0&limit=20")
        .then((response) => {
          let messages = response.data.data;

          // Sort messages by time
          messages = messages.sort(function(x, y) {
            if (parseFloat(x.created_at) < parseFloat(y.created_at)) {
              return -1;
            }
            if (parseFloat(x.created_at) > parseFloat(y.created_at)) {
              return 1;
            }
            return 0;
          });

          this.setState({messages}, () => {
            let objMessage = $('.messages');
            objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
          });
        })
        .catch((error) => {
          notifierActions.showError("Error on fetching messages");
        })
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

  
    componentDidMount = () => {

      this.fetchAllMessages(this.props.match.params.room_id);

      const  { user, history } = this.props;
      this.setState({
        ...this.state,
        socket: io(Config.CHAT_SOCKET_ENDPOINT)
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
            chatActions.enterRoomFailed(history);
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
      let nextRoomId = nextProps.match.params.room_id;
      let currentRoomId = this.props.match.params.room_id;
      if (currentRoomId !== nextRoomId) {
        this.fetchAllMessages(nextRoomId);
      }
    }

    newMessage = (m) => {

        const messages = this.state.messages;
        messages.push(m);

        let objMessage = $('.messages');
        if (objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight ) {
            this.setState({
              ...this.state,
              messages: messages
            });
            objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);

        } else {
            this.setState({
              ...this.state,
              messages: messages
            });
            if (m.sender_public_id === this.props.user.public_id) {
                objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
            }
        }
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

      let friend = this.getFriendById(this.props.match.params.room_id);


        return (

            <Card small className="mb-4">
                <CardHeader className="border-bottom">
                <h6> Chat
                </h6>
                </CardHeader>
                <CardBody className="p-0 pb-3">
                <div className="app__content">
                    <div className="chat_window">
                        <MessageList user_id={this.props.user.public_id} messages={this.state.messages}/>
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
  friends: state.friendReducer.friends
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Messages))