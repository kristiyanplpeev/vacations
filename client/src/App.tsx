import React, { Component, ReactNode } from "react";

import "./App.css";
import { Provider } from "inversify-react";
import { connect } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";

import Header from "components/Header/Header";
import Homepage from "components/Homepage/Homepage";
import NewPTO from "components/NewPTO/NewPTO";
import PTODetails from "components/PTODetails/PTODetails";
import { IAuthenticationActionCreator, IAuthService } from "inversify/interfaces";
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";
import PrivateRoute from "providers/PrivateRoute";
import { AppActions, ApplicationState, IUserState } from "store/user/types";

import "reflect-metadata";
import Login from "./components/Login/Login";
import Redirecting from "./components/Login/Redirecting";

interface AppProps extends LinkDispatchProps {
  user: IUserState;
}

interface AppState {
  allowRender: boolean;
}

class App extends Component<AppProps, AppState> {
  private authService = myContainer.get<IAuthService>(TYPES.Auth);

  constructor(props: AppProps) {
    super(props);
    this.state = {
      allowRender: false,
    };
  }

  componentDidMount(): void {
    if (!!this.authService.getToken()) {
      this.props.checkUser();
    }
    this.setState({
      allowRender: true,
    });
  }

  render(): ReactNode {
    if (!this.state.allowRender) return null;
    return (
      <div className="App">
        <BrowserRouter>
          <Provider container={myContainer}>
            <Header />
            <Switch>
              <Redirect path="/" exact to="/home" />
              <Route path="/login" component={Login} />
              <Route path="/redirecting" component={Redirecting} />
              <PrivateRoute path="/home" exact isAuthenticated={this.props.user.isAuthenticated} component={Homepage} />
              <PrivateRoute path="/new" exact isAuthenticated={this.props.user.isAuthenticated} component={NewPTO} />
              <PrivateRoute
                path="/pto/:id"
                exact
                isAuthenticated={this.props.user.isAuthenticated}
                component={PTODetails}
              />
            </Switch>
          </Provider>
        </BrowserRouter>
      </div>
    );
  }
}

interface LinkDispatchProps {
  checkUser: () => void;
}

const mapStateToProps = ({ userInfoReducer }: ApplicationState) => {
  return {
    user: userInfoReducer,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>): LinkDispatchProps => ({
  checkUser: (): void => {
    const authAction = myContainer.get<IAuthenticationActionCreator>(TYPES.AuthAction);
    dispatch(authAction.checkIfUserIsLoggedInDispatch());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
