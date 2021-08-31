import React, { ReactNode, Component } from "react";

import { AppBar, Avatar, IconButton, Toolbar, Typography, Button } from "@material-ui/core";
import { connect } from "react-redux";
import "./Header.css";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";

import { IAuthenticationActionCreator } from "inversify/interfaces";
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";
import { ApplicationState, IUserState, AppActions } from "store/user/types";

type Props = RouteComponentProps & LinkDispatchProps & LinkStateProps;

class Header extends Component<Props> {
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
              {this.props.userInfo.user.firstName} {this.props.userInfo.user.lastName}
            </Typography>
            <Avatar alt="profile_pic" src={this.props.userInfo.user.picture} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  logout = (): void => {
    this.props.logOutUser();
    localStorage.removeItem("token");
  };
}

interface LinkStateProps {
  userInfo: IUserState;
}
interface LinkDispatchProps {
  logOutUser: () => void;
}

const mapStateToProps = ({ userInfoReducer }: ApplicationState): LinkStateProps => {
  return {
    userInfo: userInfoReducer,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): LinkDispatchProps => ({
  // logOutUser: bindActionCreators(logOutUserDispatch, dispatch),
  logOutUser: (): void => {
    const authAction = myContainer.get<IAuthenticationActionCreator>(TYPES.AuthAction);
    dispatch(authAction.logOutUserDispatch());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
