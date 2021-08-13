import React, { ReactNode, Component } from "react";

import { AppBar, Avatar, IconButton, Toolbar, Typography, Button } from "@material-ui/core";
import { connect } from "react-redux";
import "./Header.css";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { startLogOutUser, startSetIsUserLoggedIn } from "store/user/action";
import { ApplicationState, UserInfoReducerState, AppActions } from "store/user/types";

interface HeaderProps {}

interface HeaderState {}

type Props = RouteComponentProps & LinkDispatchProps & LinkStateProps;

class Header extends Component<Props, HeaderState> {
  render(): ReactNode {
    if (location.pathname === "/login") return null;
    return (
      <div className="header-root">
        <AppBar position="static">
          <Toolbar>
            <Button onClick={() => this.logout()} color="inherit">
              LOGOUT
            </Button>
            <IconButton edge="start" className="header-menu-button" color="inherit" aria-label="menu"></IconButton>
            <Typography variant="h6" className="header-title">
              {this.props.userInfo.firstName} {this.props.userInfo.lastName}
            </Typography>
            <Avatar alt="profile_pic" src={this.props.userInfo.picture} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  logout = (): void => {
    this.props.logOutUser();
    this.props.setIsUserLoggedIn(false);
    localStorage.removeItem("token");
  };
}

interface LinkStateProps {
  isUserLoggedIn: boolean;
  userInfo: UserInfoReducerState;
}
interface LinkDispatchProps {
  logOutUser: () => void;
  setIsUserLoggedIn: (newState: boolean) => void;
}

const mapStateToProps = ({ isUserLoggedInReducer, userInfoReducer }: ApplicationState): LinkStateProps => {
  return {
    isUserLoggedIn: isUserLoggedInReducer,
    userInfo: userInfoReducer,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: HeaderProps,
): LinkDispatchProps => ({
  logOutUser: bindActionCreators(startLogOutUser, dispatch),
  setIsUserLoggedIn: bindActionCreators(startSetIsUserLoggedIn, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
