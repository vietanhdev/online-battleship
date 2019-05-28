import React from "react";
import { NavItem, NavLink, Badge, Collapse, DropdownItem } from "shards-react";
import { connect } from 'react-redux'
import { Button } from 'shards-react'
import { friendActions } from "../../../../redux/friends/actions";

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.toggleNotifications = this.toggleNotifications.bind(this);
  }

  toggleNotifications() {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {

    let followers = this.props.followers;
    let oneWayFollowers = [];

    for (let i = 0; i < followers.length; ++i) {
      if (!followers[i].is_friend) {
        oneWayFollowers.push(followers[i]);
      }
    }

    return (
      <NavItem className="border-right dropdown notifications">
        <NavLink
          className="nav-link-icon text-center"
          onClick={this.toggleNotifications}
        >
          <div className="nav-link-icon__wrapper">
            <i className="material-icons">&#xE7F4;</i>
            {oneWayFollowers.length > 0 ? <Badge pill theme="danger">{oneWayFollowers.length}</Badge> : "" }
          </div>
        </NavLink>
        <Collapse
          open={this.state.visible}
          className="dropdown-menu dropdown-menu-small"
        >
          <DropdownItem>
            <div className="notification__icon-wrapper">
              <div className="notification__icon">
                <i className="material-icons">&#xE6E1;</i>
              </div>
            </div>
            <div className="notification__content">
              <span className="notification__category">Welcome Message</span>
              <p>
                Welcome to iCT Gaming Zone. A product of {" "}
                <span className="text-success text-semibold">ICT Class.</span>
              </p>
              {oneWayFollowers.length > 0 ? "Following people followed you. Follow them back to be friends." : ""}
            </div>
          </DropdownItem>
          {
            oneWayFollowers.map((follower, index) =>
              <DropdownItem>
                <div className="notification__content" style={{width: "70%"}}>
                  <h5>{follower.fullname}</h5>
                </div>
                <Button theme="accent" size="sm" style={{ display: "block", float: "right"}} onClick={() => {
                  this.props.follow(follower.public_id);
                  this.setState({
                    visible: false
                  });
                }}>
                  Follow
                </Button>
              </DropdownItem>
            )
          }
          <DropdownItem className="notification__all text-center">
            * * *
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}

const mapStateToProps = (state) => ({
  followers: state.friendReducer.followers
})

const mapDispatchToProps = {
  follow: friendActions.follow
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
