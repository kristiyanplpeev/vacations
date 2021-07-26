import React, { Component, ReactNode } from "react";

import { CircularProgress } from "@material-ui/core";
import { inject, injectable } from "inversify";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import "reflect-metadata";
import { RedirectingInterface, UserServiceInterface } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import { startLogInUser, startSetIsUserLoggedIn } from "store/user/action";
import { AppActions, UserInfoTypes } from "store/user/types";

interface RedirectingProps {
  usersService: UserServiceInterface;
}

interface RedirectingState {
  error: boolean | string;
}

type Props = RedirectingProps & RouteComponentProps & LinkDispatchProps & LinkStateProps;

@injectable()
class Redirecting extends Component<Props, RedirectingState> implements RedirectingInterface {
  private userService: UserServiceInterface;

  public constructor(@inject(TYPES.UserLogger) usersService: UserServiceInterface, props: Props) {
    super(props);
    this.state = {
      error: false,
    };
    this.userService = usersService;
  }

  componentDidMount = async (): Promise<void> => {
    try {
      const userInfo = await this.userService.logInUserRequest();
      this.props.logInUser(userInfo);
      this.props.setIsUserLoggedIn(true);
      this.props.history.push("/");
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  };

  render(): ReactNode {
    if (this.state.error) {
      return <div>Error</div>;
    }
    return <CircularProgress />;
  }
}

interface LinkStateProps {}
interface LinkDispatchProps {
  logInUser: (userInfoData: UserInfoTypes) => void;
  setIsUserLoggedIn: (newState: boolean) => void;
}

const mapStateToProps = () => {};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: RedirectingProps,
): LinkDispatchProps => ({
  logInUser: bindActionCreators(startLogInUser, dispatch),
  setIsUserLoggedIn: bindActionCreators(startSetIsUserLoggedIn, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Redirecting);
