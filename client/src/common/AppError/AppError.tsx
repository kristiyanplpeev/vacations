import React, { Component, ReactNode } from "react";
import "./AppError.css";

interface AppErrorProps {
  message: string | boolean;
}

class AppError extends Component<AppErrorProps> {
  render(): ReactNode {
    return (
      <div className="AppError">
        <h1>Ooops, we crashed, try again later :)</h1>
      </div>
    );
  }
}

export default AppError;
