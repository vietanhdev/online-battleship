import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  FormInput,
  Button
} from "shards-react";



import { friendActions } from '../../redux/friends/actions'

export class FindUser extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: ""
    }
  }


  enterKeyInFindInput(e) {
    if (e.keyCode === 13) {
      this.props.follow(this.state.value);
    }
  }


  handleChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }

  render() {
    return (
        <div className="m-2">
            <InputGroup seamless>
                <InputGroupAddon type="prepend">
                    <InputGroupText>
                        <i className="material-icons">add</i>
                    </InputGroupText>
                </InputGroupAddon>
                <FormInput onChange={this.handleChange} onKeyUp={(e) => this.enterKeyInFindInput(e)} placeholder="Type friend id to add" />
                <InputGroupAddon type="append">
                    <Button onClick={() => this.props.follow(this.state.value)} theme="secondary" outline >+</Button>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  follow: friendActions.follow
}

export default connect(mapStateToProps, mapDispatchToProps)(FindUser)
