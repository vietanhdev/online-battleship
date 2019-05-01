import React from "react";
import { connect } from 'react-redux';

import classNames from "classnames";
import { Col } from "shards-react";

import SidebarMainNavbar from "./SidebarMainNavbar";
import SidebarNavItems from "./SidebarNavItems";


class MainSidebar extends React.Component {


  render() {
    const classes = classNames(
      "main-sidebar",
      "px-0",
      "col-12",
      this.props.menuVisible && "open"
    );

    return (
      <Col
        tag="aside"
        className={classes}
        lg={{ size: 1 }}
        md={{ size: 2 }}
      >
        <SidebarMainNavbar hideLogoText={this.props.hideLogoText} />
        <SidebarNavItems />
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  menuVisible: state.appReducer.menuVisible,
  sidebarNavItems: state.appReducer.navItems
})

const mapDispatchToProps = {
  
}


export default connect(mapStateToProps, mapDispatchToProps)(MainSidebar);
