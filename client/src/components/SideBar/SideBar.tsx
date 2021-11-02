import React, { Component } from "react";

import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import "./SideBar.css";
import { RouteComponentProps, withRouter } from "react-router";

interface SidebarProps extends RouteComponentProps {}

class SideBar extends Component<SidebarProps> {
  render(): JSX.Element {
    return (
      <Drawer variant="permanent">
        <Toolbar />
        <div>
          <List className="admin-sidebar-list">
            <ListItem button onClick={() => this.props.history.push("/admin/users")} key={"1"}>
              <Typography component="span" className="admin-sidebar-text" variant="body2" color="textPrimary">
                Users
              </Typography>
            </ListItem>
            <Divider />
            <ListItem button onClick={() => this.props.history.push("/admin/teams")} key={"2"}>
              <Typography component="span" className="admin-sidebar-text" variant="body2" color="textPrimary">
                Teams
              </Typography>
            </ListItem>
            <Divider />
            <ListItem button key={"3"}>
              <Typography component="span" className="admin-sidebar-text" variant="body2" color="textPrimary">
                Positions
              </Typography>
            </ListItem>
            <Divider />
          </List>
        </div>
      </Drawer>
    );
  }
}

export default withRouter(SideBar);
