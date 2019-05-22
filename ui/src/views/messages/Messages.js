import React from 'react';
import { withRouter } from "react-router";
import $ from 'jquery';
import MessageList from './MessageList';
import Input from './Input';
import _map from 'lodash/map';
import io from 'socket.io-client';

import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import Friends from "../../components/friends/Friends"
import { connect } from 'react-redux'

import Config from '../../config'
import { requestStatus } from '../../redux/services/http'

import { chatActions } from '../../redux/chat/actions'

import './styles.css';

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [
                {id: 1, userId: 0, userName: props.user.fullname, message: 'Hello'}
            ],
            user: 1,
            socket: null,
        }
    }

  
    componentDidMount() {

      const  { user, history } = this.props;
  
      const socket = io(Config.GAME_ROOM_SOCKET_ENDPOINT);
  
      socket.on('connect', function(){
        console.log('SocketIO: Connected to server')
      });
  
      socket.on('disconnect', function(){
        console.log('SocketIO: Disconnected from server')
      });
  
      // Process login response
      socket.on('response_login', function(data){

        console.log("Response login")
  
        console.log(data)
  
        if (data.status !== requestStatus.SUCCESS) {
          chatActions.enterRoomFailed(history);
        } else {
          console.log('Authorized successfully.')
        }
        
      });

      socket.on('newMessage', (response) => {this.newMessage(response)});


      // Login
      socket.emit('request_login', {
        'authorization': 'user.token'
      })

      console.log(user.token)
  
    }

    newMessage(m) {
        const messages = this.state.messages;
        let ids = _map(messages, 'id');
        let max = Math.max(...ids);
        messages.push({
            id: max+1,
            userId: m.id,
            userName: 'vietanhdev',
            message: m.data
        });

        let objMessage = $('.messages');
        if (objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight ) {
            this.setState({messages});
            objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);

        } else {
            this.setState({messages});
            if (m.id === this.state.user) {
                objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
            }
        }
    }

    sendnewMessage(m) {
        if (m.value) {
            this.state.socket.emit("newMessage", m.value);
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
                              <MessageList user={this.state.user} messages={this.state.messages} typing={this.state.typing}/>
                              <Input sendMessage={this.sendnewMessage.bind(this)}/>
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