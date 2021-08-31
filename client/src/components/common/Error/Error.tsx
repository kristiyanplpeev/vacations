import React, { Component, ReactNode } from "react";
import "./Error.css";

class Error extends Component {
  render(): ReactNode {
    return (
      <div className="app-error">
        <h1>Ooops, we crashed, try again later :)</h1>
      </div>
    );
  }
}

export default Error;
