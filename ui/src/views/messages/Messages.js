import React from 'react';
import { withRouter } from "react-router";
import $ from 'jquery';
import MessageList from './MessageList';
import Input from './Input';
import io from 'socket.io-client';

import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Friends from "../../components/friends/Friends"
import { connect } from 'react-redux'

import Config from '../../config'
import request, { requestStatus } from '../../redux/services/http'

import { chatActions } from '../../redux/chat/actions'

import './styles.css';

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            socket: null,
        }
    }

  
    componentDidMount = () => {

      // Load old messages
      request.get("/messages/"+this.props.match.params.room_id+"?offset=0&limit=20")
      .then((response) => {
        let messages = response.data.data;
        messages.map(m => {
          this.newMessage(m);
        });
      })
      .catch((error) => {
        console.log(error);
      })

      const  { user, history } = this.props;
      this.setState({
        ...this.state,
        socket: io(Config.CHAT_SOCKET_ENDPOINT)
      }, () => {
        console.log(this.state.socket)
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

    componentDidUpdate() {
        if (this.state.typing) {
            if (true) {}
        }
    }

    typing(data) {
        if (data) {
            let objMessage = $('.messages');
            if (objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight) {
                this.setState({typing: false});
                objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
            } else {
                this.setState({typing: false});
            }
        } else {
            this.setState({typing: false})
        }
    }
    render () {

        return (

          <Container fluid className="main-content-container px-4 mt-4">
            <Row>
              <Col md="9">
                <Row>
                  <Col>
                    <Card small className="mb-4">
                      <CardHeader className="border-bottom">
                        <h6 className="m-0">Sy An</h6>
                      </CardHeader>
                      <CardBody className="p-0 pb-3">
                        <div className="app__content">
                          <div className="chat_window">
                              <MessageList user_id={this.props.user.public_id} messages={this.state.messages} typing={this.state.typing}/>
                              <Input sendMessage={this.sendNewMessage.bind(this)}/>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col md="3">
                <Friends></Friends>
              </Col>
            </Row>

          </Container>
        )
    }
}


const mapStateToProps = (state) => ({
  user: state.userReducer
})

const mapDispatchToProps = {
  enterRoom: chatActions.enterRoom
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Messages))