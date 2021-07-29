import React, { Component, ReactNode } from "react";

import "./App.css";

import { Provider } from "inversify-react";
import { connect } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from "components/Header/Header";
import Homepage from "components/Homepage/Homepage";
import { myContainer } from "inversify/inversify.config";
import PrivateRoute from "providers/PrivateRoute";
import { ApplicationState, UserInfoReducerState } from "store/user/types";

import "reflect-metadata";
import Login from "./components/Login/Login";
import Redirecting from "./components/Login/Redirecting";

interface AppProps {
  userStatus: boolean;
  userInfo: UserInfoReducerState;
}

class App extends Component<AppProps> {
  render(): ReactNode {
    return (
      <div className="App">
        <BrowserRouter>
          <Provider container={myContainer}>
            <Header />
            <Switch>
              <Redirect path="/" exact to="/home" />
              <Route path="/login" component={Login} />
              <Route path="/redirecting" component={Redirecting} />
              <PrivateRoute path="/home" exact isAuthenticated={this.props.userStatus} component={Homepage} />
            </Switch>
          </Provider>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = ({ isUserLoggedInReducer, userInfoReducer }: ApplicationState) => {
  return {
    userStatus: isUserLoggedInReducer,
    userInfo: userInfoReducer,
  };
};

export default connect(mapStateToProps)(App);
