import React, { Component, ReactNode } from "react";

import "./App.css";
import DateFnsAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Provider } from "inversify-react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Switch, Route, Redirect } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";

import { UserRolesEnum } from "common/constants";
import AbsenceDetails from "components/AbsenceDetails/AbsenceDetails";
import AdminPanel from "components/AdminPanel/AdminPanel";
import BulkChangeUsers from "components/BulkChangeUsers/BulkChangeUsers";
import Header from "components/Header/Header";
import Homepage from "components/Homepage/Homepage";
import AddAndEditAbsence from "components/NewAbsence/AddAndEditAbsence";
import Positions from "components/Positions/Positions";
import SideBar from "components/SideBar/SideBar";
import TeamAbsences from "components/TeamAbsences/TeamAbsences";
import UsersList from "components/UsersList/UsersList";
import { IAuthenticationActionCreator } from "inversify/interfaces";
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";
import PrivateRoute from "providers/PrivateRoute";
import { AppActions, ApplicationState, IUserState } from "store/user/types";

import "reflect-metadata";
import Login from "./components/Login/Login";
import Redirecting from "./components/Login/Redirecting";

interface AppProps extends LinkDispatchProps, RouteComponentProps {
  user: IUserState;
}

interface AppState {
  allowRender: boolean;
}

class App extends Component<AppProps, AppState> {
  private userState: IUserState;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      allowRender: false,
    };
    this.userState = props.user;
  }

  componentDidMount(): void {
    this.props.checkUser();
    this.setState({
      allowRender: true,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render(): ReactNode {
    if (!this.state.allowRender) return null;
    this.userState = this.props.user;
    return (
      <div className="App">
        <LocalizationProvider dateAdapter={DateFnsAdapter}>
          <Provider container={myContainer}>
            <Header />
            {this.props.location.pathname.includes("/admin") && <SideBar />}
            <Switch>
              <Redirect path="/" exact to="/home" />
              <Route path="/login" component={Login} />
              <Route path="/redirecting" component={Redirecting} />
              <PrivateRoute
                path="/home"
                exact
                isAuthenticated={this.isUserAuthenticated(UserRolesEnum.user)}
                component={Homepage}
              />
              <PrivateRoute
                path="/new/:type"
                exact
                isAuthenticated={this.isUserAuthenticated(UserRolesEnum.user)}
                component={AddAndEditAbsence}
              />
              <PrivateRoute
                path="/edit/:type/:id"
                exact
                isAuthenticated={this.isUserAuthenticated(UserRolesEnum.user)}
                component={AddAndEditAbsence}
              />
              <PrivateRoute
                path="/absence/:id"
                exact
                isAuthenticated={this.isUserAuthenticated(UserRolesEnum.user)}
                component={AbsenceDetails}
              />
              <PrivateRoute
                path="/admin"
                exact
                isAuthenticated={this.isUserAuthenticated(UserRolesEnum.admin)}
                component={AdminPanel}
              />
              <PrivateRoute
                path="/admin/users"
                exact
                isAuthenticated={this.isUserAuthenticated(UserRolesEnum.admin)}
                component={UsersList}
              />
              <PrivateRoute
                path="/admin/change/:ids"
                exact
                isAuthenticated={this.isUserAuthenticated(UserRolesEnum.admin)}
                component={BulkChangeUsers}
              />
              <PrivateRoute
                path="/admin/positions"
                exact
                isAuthenticated={this.isUserAuthenticated(UserRolesEnum.admin)}
                component={Positions}
              />
              <PrivateRoute
                path="/team-absences"
                exact
                isAuthenticated={this.isUserAuthenticated(UserRolesEnum.user)}
                component={TeamAbsences}
              />
            </Switch>
          </Provider>
        </LocalizationProvider>
      </div>
    );
  }

  isUserAuthenticated(role: UserRolesEnum): boolean {
    if (role === UserRolesEnum.admin) {
      return this.userState.isAuthenticated && this.userState.userDetails.role === UserRolesEnum.admin;
    } else {
      return this.userState.isAuthenticated;
    }
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

const routerWrapper = withRouter(App);

export default connect(mapStateToProps, mapDispatchToProps)(routerWrapper);
