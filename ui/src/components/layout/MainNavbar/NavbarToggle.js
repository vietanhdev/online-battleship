import React from "react";
import { connect } from 'react-redux';

import {appActions} from "../../../redux/app/actions"

class NavbarToggle extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Toggle sidebar
    const {toggleSidebar} = this.props;
    toggleSidebar();
  }

  render() {
    return (
      <nav className="nav">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" onClick={this.handleClick} className="nav-link nav-link-icon toggle-sidebar d-sm-inline d-md-inline d-lg-none text-center">
          <i className="material-icons">&#xE5D2;</i>
        </a>
      </nav>
    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
  toggleSidebar: appActions.toggleSidebar
}


export default connect(mapStateToProps, mapDispatchToProps)(NavbarToggle);