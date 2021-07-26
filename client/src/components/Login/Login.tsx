import { ReactNode } from "react";
import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import GoogleButton from "react-google-button";

import "./Login.css";
import { BASE_URL } from "common/constants";

class Login extends Component {
  render(): ReactNode {
    return (
      <div className="login-container">
        <Avatar className="login-avatar">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <GoogleButton
          className="login-google-button"
          onClick={() => window.location.assign(`${BASE_URL}auth/google`)}
        />
      </div>
    );
  }
}

export default Login;
