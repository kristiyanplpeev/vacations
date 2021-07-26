import React, { Component, ReactNode } from "react";

import { Button } from "@material-ui/core";
import "./Homepage.css";
import { RouteComponentProps } from "react-router";

interface HomepageProps extends RouteComponentProps {}

class Homepage extends Component<HomepageProps> {
  render(): ReactNode {
    return (
      <div className="homepage-root">
        <h1 className="homapage-header">Paid Time Off</h1>
        <Button
          className="homapage-addpto-button"
          onClick={() => this.props.history.push("/new")}
          variant="outlined"
          color="primary"
        >
          Add PTO
        </Button>
      </div>
    );
  }
}

export default Homepage;
