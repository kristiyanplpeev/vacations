import React, { Component, ReactNode } from "react";

import { CircularProgress } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import { resolve } from "inversify-react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";

import "reflect-metadata";
import Error from "components/common/Error/Error";
import { IAuthenticationActionCreator, IAuthService } from "inversify/interfaces";
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";
import { AppActions, ApplicationState, IUserState } from "store/user/types";

interface RedirectingProps {}

interface RedirectingState {
  error: string;
}

type Props = RedirectingProps & RouteComponentProps & LinkDispatchProps & LinkStateProps;

class Redirecting extends Component<Props, RedirectingState> {
  @resolve(TYPES.Auth) authService!: IAuthService;

  public constructor(props: Props) {
    super(props);
    this.state = {
      error: "",
    };
  }

  componentDidMount = (): void => {
    try {
      this.props.logInUser();
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  };

  componentDidUpdate(): void {
    if (this.props.userInfo.isAuthenticated) {
      this.props.history.push("/home");
    }
  }

  render(): ReactNode {
    if (this.state.error) {
      return <Error message={this.state.error} />;
    }
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
}

interface LinkStateProps {
  userInfo: IUserState;
}
interface LinkDispatchProps {
  logInUser: () => void;
}

const mapStateToProps = ({ userInfoReducer }: ApplicationState): LinkStateProps => {
  return {
    userInfo: userInfoReducer,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): LinkDispatchProps => ({
  // logInUser: bindActionCreators(logInUserDispatch, dispatch),
  logInUser: async (): Promise<void> => {
    const authAction = myContainer.get<IAuthenticationActionCreator>(TYPES.AuthAction);
    dispatch(authAction.logInUserDispatch());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Redirecting);
