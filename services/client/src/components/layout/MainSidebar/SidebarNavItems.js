import React from "react";
import { Nav } from "shards-react";
import { connect } from 'react-redux';

import SidebarNavItem from "./SidebarNavItem";

class SidebarNavItems extends React.Component {

  render() {
    const { navItems } = this.props;
    return (
      <div className="nav-wrapper">
        <Nav className="nav--no-borders flex-column">
          {navItems.map((item, idx) => (
            <SidebarNavItem key={idx} item={item} />
          ))}
        </Nav>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  menuVisible: state.appReducer.menuVisible,
  navItems: state.appReducer.navItems
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarNavItems);

