import React, { Component, ReactNode } from "react";

import "./App.css";

import { connect } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from "components/Header/Header";
import Homepage from "components/Homepage/Homepage";
import NewPTO from "components/NewPTO/NewPTO";
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
            <PrivateRoute path="/new" exact isAuthenticated={this.props.userStatus} component={NewPTO} />
          </Switch>
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
