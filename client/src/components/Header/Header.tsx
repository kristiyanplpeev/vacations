import React, { ReactNode, Component } from "react";

import { AppBar, Avatar, IconButton, Toolbar, Typography, Button, Menu, Divider } from "@material-ui/core";
import { connect } from "react-redux";
import "./Header.css";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";

import { UserRolesEnum } from "common/constants";
import { IAuthenticationActionCreator } from "inversify/interfaces";
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";
import { ApplicationState, IUserState, AppActions } from "store/user/types";

interface HeaderProps extends RouteComponentProps {
  userInfo: IUserState;
  logOutUser: () => void;
}

interface HeaderState {
  anchorEl: HTMLElement | null;
}

export class Header extends Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
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
            <Button onClick={() => this.props.history.push("/team-absences")} color="inherit">
              Team absences
            </Button>
            {this.props.userInfo.userDetails.role === UserRolesEnum.admin && (
              <Button
                data-unit-test="admin-panel-button"
                onClick={() => this.props.history.push("/admin")}
                color="inherit"
              >
                Admin
              </Button>
            )}
            <Button onClick={() => this.props.history.push("/sprint-planning")} color="inherit">
              Sprint Planning
            </Button>
            <IconButton edge="start" className="header-menu-button" color="inherit" aria-label="menu"></IconButton>
            <Typography variant="h6" className="header-title">
              {this.props.userInfo.userDetails.firstName} {this.props.userInfo.userDetails.lastName}
            </Typography>
            <div onClick={(event: React.MouseEvent<HTMLElement>) => this.handleProfilePicClick(event)}>
              <Avatar alt="profile_pic" src={this.props.userInfo.userDetails.picture} />
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
        <Avatar className="header-profile-menu-pic" alt="profile_pic" src={this.props.userInfo.userDetails.picture} />
        <Typography variant="h6">
          {this.props.userInfo.userDetails.firstName} {this.props.userInfo.userDetails.lastName}
        </Typography>
        <Typography variant="subtitle2">{this.props.userInfo.userDetails.email}</Typography>
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

const mapStateToProps = ({ userInfoReducer }: ApplicationState) => {
  return {
    userInfo: userInfoReducer,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>) => ({
  // logOutUser: bindActionCreators(logOutUserDispatch, dispatch),
  logOutUser: (): void => {
    const authAction = myContainer.get<IAuthenticationActionCreator>(TYPES.AuthAction);
    dispatch(authAction.logOutUserDispatch());
  },
});

const routerWrapper = withRouter(Header);

export default connect(mapStateToProps, mapDispatchToProps)(routerWrapper);
