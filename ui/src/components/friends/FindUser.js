import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  FormInput,
  Button
} from "shards-react";

export class FindUser extends Component {

  render() {
    return (
        <div className="m-2">
            <InputGroup seamless>
                <InputGroupAddon type="prepend">
                    <InputGroupText>
                        <i className="material-icons">add</i>
                    </InputGroupText>
                </InputGroupAddon>
                <FormInput placeholder="Type friend id to add" />
                <InputGroupAddon type="append">
                    <Button theme="secondary" outline>Follow</Button>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(FindUser)
