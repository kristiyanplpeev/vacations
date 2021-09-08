import React, { Component } from "react";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { resolve } from "inversify-react";

import "./UsersList.css";
import { IUser } from "common/interfaces";
import Error from "components/common/Error/Error";
import { IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface UsersListProps {}

interface UsersListState {
  error: boolean;
  loading: boolean;
  users: Array<IUser>;
}

class UsersList extends Component<UsersListProps, UsersListState> {
  @resolve(TYPES.user) private userService!: IUserService;

  constructor(props: UsersListProps) {
    super(props);
    this.state = {
      error: false,
      loading: false,
      users: [],
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      this.setState({
        loading: true,
      });
      const users = await this.userService.getAllUsers();
      this.setState({
        users,
      });
    } catch (error) {
      this.setState({
        error: true,
      });
    }
    this.setState({
      loading: false,
    });
  }

  render(): JSX.Element {
    if (this.state.error) {
      return <Error />;
    }
    return (
      <div className="users-container">
        <Typography className="users-title" variant="h4" component="h2">
          Users
        </Typography>
        {this.renderUsers()}
      </div>
    );
  }

  renderUsers(): Array<JSX.Element> {
    return this.state.users.map((el) => {
      if (this.state.loading) {
        return <CircularProgress key={el.id} />;
      }
      return (
        <Card key={el.id} className="users-card">
          <CardActionArea>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Avatar className="users-avatar" alt={el.firstName} src={el.picture} />
                  <Typography variant="h5" className="users-names">
                    {el.firstName} {el.lastName}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      );
    });
  }
}

export default UsersList;
