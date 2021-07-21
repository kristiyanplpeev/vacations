import React from "react";

import { Route, Redirect, RouteProps } from "react-router-dom";

const PrivateRoute: React.FC<
  {
    path: string;
    isAuthenticated: boolean;
    exact: boolean;
  } & RouteProps
> = (props) => {
  return props.isAuthenticated ? (
    <Route path={props.path} exact={props.exact} component={props.component} />
  ) : (
    <Redirect to="/login" />
  );
};
export default PrivateRoute;
