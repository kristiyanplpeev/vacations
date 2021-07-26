import React, { Component, ReactNode } from "react";

import "./App.css";

import { connect } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from "components/Header/Header";
import Homepage from "components/Homepage/Homepage";
import PrivateRoute from "providers/PrivateRoute";
import { ApplicationState, UserInfoReducerState } from "store/user/types";

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
          <Header />
          <Switch>
            <Redirect path="/" exact to="/home" />
            <Route path="/login" component={Login} />
            <Route path="/redirecting" component={Redirecting} />
            <PrivateRoute path="/home" exact isAuthenticated={this.props.userStatus} component={Homepage} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = ({ userStatusReducer, userInfoReducer }: ApplicationState) => {
  return {
    userStatus: userStatusReducer,
    userInfo: userInfoReducer,
  };
};

export default connect(mapStateToProps)(App);
