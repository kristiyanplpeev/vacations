import React, { Component } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { resolve } from "inversify-react";
import "./UsersList.css";
import { RouteComponentProps } from "react-router";

import { IUserWithTeamAndPosition } from "common/interfaces";
import Error from "components/common/Error/Error";
import { IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface UsersListProps extends RouteComponentProps {}

interface UsersListState {
  error: boolean;
  loading: boolean;
  users: Array<IUserWithTeamAndPosition>;
  selectedUsers: Array<string>;
}

class UsersList extends Component<UsersListProps, UsersListState> {
  @resolve(TYPES.user) private userService!: IUserService;

  constructor(props: UsersListProps) {
    super(props);
    this.state = {
      error: false,
      loading: false,
      users: [],
      selectedUsers: [],
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
        {this.renderChangeButton()}
        {this.renderUsers()}
      </div>
    );
  }

  renderChangeButton(): JSX.Element {
    const selectedUsersLength = this.state.selectedUsers.length;
    const selectedUsersString = this.state.selectedUsers.join("&");
    return (
      <>
        <Button
          className={selectedUsersLength ? "users-change-button" : "users-change-button-hidden"}
          variant="outlined"
          color="primary"
          onClick={() => this.props.history.push(`/admin/change/${selectedUsersString}`)}
        >
          Change selected
        </Button>
      </>
    );
  }

  renderUsers(): Array<JSX.Element> {
    return this.state.users.map((el) => {
      if (this.state.loading) {
        return <CircularProgress key={el.id} />;
      }
      return (
        <Card
          onClick={() => this.addUserToSelected(el.id)}
          key={el.id}
          className={this.isUserSelected(el.id) ? "users-card users-card-selected" : "users-card"}
        >
          <CardActionArea>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Avatar className="users-avatar" alt={el.firstName} src={el.picture} />
                  <Typography variant="h5" className="users-names">
                    {el.firstName} {el.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" className="users-names">
                    {el.position}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" className="users-names">
                    {el.team}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      );
    });
  }

  addUserToSelected(userId: string): void {
    if (!this.state.selectedUsers.includes(userId)) {
      this.setState({
        selectedUsers: [...this.state.selectedUsers, userId],
      });
    } else {
      const decrementedUsers = this.state.selectedUsers.filter((el) => el !== userId);
      this.setState({
        selectedUsers: decrementedUsers,
      });
    }
  }

  isUserSelected(userId: string): boolean {
    return this.state.selectedUsers.includes(userId);
  }
}

export default UsersList;
