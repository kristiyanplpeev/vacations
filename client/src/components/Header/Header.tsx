import React, { ReactNode, Component } from "react";

import { AppBar, Avatar, IconButton, Toolbar, Typography, Button } from "@material-ui/core";
import { connect } from "react-redux";
import "./Header.css";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { UserInfoType } from "common/types";
import { logOutUser, setLoginStatus } from "store/user/action";
import { ApplicationState, UserInfoReducerState } from "store/user/types";

interface HeaderProps extends RouteComponentProps {
  userStatus: boolean;
  userInfo: UserInfoReducerState;
}

interface HeaderState {
  isUserLogged: boolean;
  userInfo: UserInfoType;
}

class Header extends Component<HeaderProps, HeaderState> {
  state = {
    isUserLogged: false,
    userInfo: { id: "", googleId: "", email: "", firstName: "", lastName: "", picture: "" },
  };

  render(): ReactNode {
    this.setUserStatus();
    if (location.pathname === "/login") return null;
    return (
      <div className="header-root">
        <AppBar position="static">
          <Toolbar>
            <Button onClick={() => this.logout()} color="inherit">
              LOGOUT
            </Button>
            <IconButton edge="start" className="header-menubutton" color="inherit" aria-label="menu"></IconButton>
            <Typography variant="h6" className="header-title">
              {this.state.userInfo.firstName} {this.state.userInfo.lastName}
            </Typography>
            <Avatar alt="profile_pic" src={this.state.userInfo.picture} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
  setUserStatus = (): void => {
    if (this.props.userStatus !== this.state.isUserLogged) {
      this.setState({
        isUserLogged: this.props.userStatus,
        userInfo: this.props.userInfo,
      });
    }
  };

  logout = (): void => {
    logOutUser();
    setLoginStatus(false);
    localStorage.removeItem("token");
  };
}

const mapStateToProps = ({ userStatusReducer, userInfoReducer }: ApplicationState) => {
  return {
    userStatus: userStatusReducer,
    userInfo: userInfoReducer,
  };
};

export default connect(mapStateToProps)(withRouter(Header));
