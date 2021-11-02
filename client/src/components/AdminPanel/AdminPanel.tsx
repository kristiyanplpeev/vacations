import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./AdminPanel.css";
import { RouteComponentProps } from "react-router";

interface AdminPanelProps extends RouteComponentProps {}

class AdminPanel extends Component<AdminPanelProps> {
  render(): JSX.Element {
    return (
      <div className="admin-panel-container">
        <Typography className="admin-panel-title" variant="h4" component="h2">
          Administration Panel
        </Typography>
        <Button
          className="admin-panel-button"
          onClick={() => this.props.history.push("/admin/users")}
          variant="contained"
          size="large"
          color="primary"
        >
          Users
        </Button>
        <Button
          className="admin-panel-button"
          onClick={() => this.props.history.push("/admin/teams")}
          variant="contained"
          size="large"
          color="primary"
        >
          Teams
        </Button>
        <Button className="admin-panel-button" variant="contained" size="large" color="primary">
          Positions
        </Button>
      </div>
    );
  }
}

export default AdminPanel;
