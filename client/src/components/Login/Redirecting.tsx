import React, { Component, ReactNode } from "react";

import { CircularProgress } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import { injectable } from "inversify";
import { resolve } from "inversify-react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import "reflect-metadata";
import AppError from "common/AppError/AppError";
import { IRedirecting, IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import { startLogInUser, startSetIsUserLoggedIn } from "store/user/action";
import { AppActions, UserInfoTypes } from "store/user/types";

interface RedirectingProps {}

interface RedirectingState {
  error: string;
}

type Props = RedirectingProps & RouteComponentProps & LinkDispatchProps & LinkStateProps;

@injectable()
class Redirecting extends Component<Props, RedirectingState> implements IRedirecting {
  @resolve(TYPES.UserLogger) usersService!: IUserService;

  public constructor(props: Props) {
    super(props);
    this.state = {
      error: "",
    };
  }

  componentDidMount = async (): Promise<void> => {
    try {
      const userInfo = await this.usersService.logInUserRequest();
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
      return <AppError message={this.state.error} />;
    }
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
}

interface LinkStateProps {}
interface LinkDispatchProps {
  logInUser: (userInfoData: UserInfoTypes) => void;
  setIsUserLoggedIn: (newState: boolean) => void;
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: RedirectingProps,
): LinkDispatchProps => ({
  logInUser: bindActionCreators(startLogInUser, dispatch),
  setIsUserLoggedIn: bindActionCreators(startSetIsUserLoggedIn, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Redirecting);
