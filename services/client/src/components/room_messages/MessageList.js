import React from 'react';
import Message from './MessageItem';


export default class MessageItem extends React.Component {
    render () {
        return (
            <ul className="messages">
                {this.props.messages.map((item, index) =>
                    <Message key={index} user={item.sender_public_id === this.props.user_id? true: false} message={item.content}/>
                )}
            </ul>
        )
    }
}