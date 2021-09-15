import React, { Component, ReactNode } from "react";
import "./Error.css";

interface ErrorProps {
  message: string;
}

class Error extends Component<ErrorProps> {
  constructor(props: ErrorProps) {
    super(props);
  }
  render(): ReactNode {
    return (
      <div className="app-error">
        <h1>{this.props.message}</h1>
      </div>
    );
  }
}

export default Error;
