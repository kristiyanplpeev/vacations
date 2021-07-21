import React, { Component, ReactNode } from "react";

import { RouteComponentProps } from "react-router-dom";

import { BASE_URL } from "common/constants";

export interface WelcomeProps extends RouteComponentProps {}

export interface WelcomeState {
  loading: boolean;
  message: { id: string; name: string }[];
}

class Welcome extends Component<WelcomeProps, WelcomeState> {
  state = {
    message: [{ id: "", name: "unknown" }],
    loading: false,
  };

  render(): ReactNode {
    if (this.state.loading) {
      return <div> Loading... </div>;
    }
    return (
      <div>
        <button onClick={async () => await this.ping()}>Check server status:</button>

        {this.state.message.map((el, index) => (
          <div key={index}>
            {el.name}
            <br></br>
          </div>
        ))}
      </div>
    );
  }

  ping = async (): Promise<void> => {
    this.setState({
      loading: true,
    });
    try {
      const response = await fetch(`${BASE_URL}ping`);
      const responseJSON = await response.json();
      this.setState((prevState) => ({
        message: [...prevState.message, responseJSON[0]],
        loading: false,
      }));
    } catch (err) {
      this.setState((prevState) => ({
        message: [...prevState.message, { id: "", name: "not ok" }],
        loading: false,
      }));
    }
  };
}

export default Welcome;
