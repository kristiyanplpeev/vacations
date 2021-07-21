import React, { Component, ReactNode } from "react";

import { CircularProgress } from "@material-ui/core";
import { RouteComponentProps } from "react-router-dom";

import { BASE_URL } from "common/constants";
import { extractUser } from "providers/tokenManagment";
import { logInUser, setLoginStatus } from "store/user/action";

interface RedirectingProps extends RouteComponentProps {}

interface RedirectingState {
  error: boolean;
}

class Redirecting extends Component<RedirectingProps, RedirectingState> {
  componentDidMount = async (): Promise<void> => {
    try {
      const res = await fetch(`${BASE_URL}auth/users`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resJSON = await res.json();
      const userInfo = extractUser(resJSON.access_token);
      logInUser(userInfo);
      setLoginStatus(true);
      localStorage.setItem("token", resJSON.access_token);
      this.props.history.push("/");
    } catch (error) {
      this.setState({
        error: true,
      });
    }
  };

  state = {
    error: false,
  };

  render(): ReactNode {
    if (this.state.error) {
      return <div>Error</div>;
    }
    return <CircularProgress />;
  }
}

export default Redirecting;
