import React, { ReactNode, Component } from "react";

import { AppBar, Avatar, IconButton, Toolbar, Typography, Button, Menu, Divider } from "@material-ui/core";
import { connect } from "react-redux";
import "./Header.css";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";

import { IAuthenticationActionCreator } from "inversify/interfaces";
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";
import { ApplicationState, IUserState, AppActions } from "store/user/types";

type Props = RouteComponentProps & LinkDispatchProps & LinkStateProps;

interface HeaderState {
  anchorEl: HTMLElement | null;
}

class Header extends Component<Props, HeaderState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  render(): ReactNode {
    if (location.pathname === "/login") return null;
    return (
      <div className="header-root">
        <AppBar className="app-bar" position="static">
          <Toolbar>
            <Button onClick={() => this.props.history.push("/home")} color="inherit">
              My absences
            </Button>
            <Button onClick={() => {}} color="inherit">
              Team absences
            </Button>
            <Button onClick={() => this.props.history.push("/admin")} color="inherit">
              Admin
            </Button>
            <IconButton edge="start" className="header-menu-button" color="inherit" aria-label="menu"></IconButton>
            <Typography variant="h6" className="header-title">
              {this.props.userInfo.user.firstName} {this.props.userInfo.user.lastName}
            </Typography>
            <div onClick={(event: React.MouseEvent<HTMLElement>) => this.handleProfilePicClick(event)}>
              <Avatar alt="profile_pic" src={this.props.userInfo.user.picture} />
            </div>
          </Toolbar>
        </AppBar>
        {this.renderProfileMenu()}
      </div>
    );
  }

  renderProfileMenu(): JSX.Element {
    return (
      <Menu
        className="header-profile-menu"
        id="mouse-over-popover"
        open={Boolean(this.state.anchorEl)}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={() => this.handlePopoverClose()}
        keepMounted
        getContentAnchorEl={null}
      >
        <Avatar className="header-profile-menu-pic" alt="profile_pic" src={this.props.userInfo.user.picture} />
        <Typography variant="h6">
          {this.props.userInfo.user.firstName} {this.props.userInfo.user.lastName}
        </Typography>
        <Typography variant="subtitle2">{this.props.userInfo.user.email}</Typography>
        <Divider className="header-profile-menu-divider" />
        <Button onClick={() => this.logout()} color="inherit">
          Sign out
        </Button>
      </Menu>
    );
  }

  logout = (): void => {
    this.props.logOutUser();
    localStorage.removeItem("token");
  };

  handleProfilePicClick(event: React.MouseEvent<HTMLElement>): void {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  handlePopoverClose(): void {
    this.setState({
      anchorEl: null,
    });
  }
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
