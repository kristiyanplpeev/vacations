/* eslint-disable sonarjs/cognitive-complexity */
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

import { anyPosition, anyRole, anyTeam, noTeam, PositionsEnum, usersListClass } from "common/constants";
import { IPositions, ITeams, IUserWithTeamAndPosition } from "common/interfaces";
import Error from "components/common/Error/Error";
import SelectElements from "components/common/SelectElements/SelectElements";
import { IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface UsersListProps extends RouteComponentProps {}

interface UsersListState {
  error: string;
  loading: boolean;
  users: Array<IUserWithTeamAndPosition>;
  selectedUsers: Array<string>;
  teams: Array<ITeams>;
  positions: Array<IPositions>;
  selectedTeam: string;
  selectedPosition: string;
  selectedRole: string;
}

class UsersList extends Component<UsersListProps, UsersListState> {
  @resolve(TYPES.user) private userService!: IUserService;

  constructor(props: UsersListProps) {
    super(props);
    this.state = {
      error: "",
      loading: false,
      users: [],
      selectedUsers: [],
      teams: [],
      positions: [],
      selectedTeam: anyTeam,
      selectedPosition: anyPosition,
      selectedRole: anyRole,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      this.setState({
        loading: true,
      });
      const users = await this.userService.getFilteredUsers(anyTeam, anyPosition, anyRole);
      const teams = await this.userService.getTeams();
      const positions = await this.userService.getPositions();
      this.setState({
        users,
        teams,
        positions,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
    this.setState({
      loading: false,
    });
  }

  async componentDidUpdate(prevProps: UsersListProps, prevState: UsersListState): Promise<void> {
    if (
      this.state.selectedPosition !== prevState.selectedPosition ||
      this.state.selectedRole !== prevState.selectedRole ||
      this.state.selectedTeam !== prevState.selectedTeam
    ) {
      try {
        this.setState({
          loading: true,
        });
        const users = await this.userService.getFilteredUsers(
          this.state.selectedTeam,
          this.state.selectedPosition,
          this.state.selectedRole,
        );
        this.setState({
          users,
          loading: false,
        });
      } catch (error) {
        this.setState({
          error: error.message,
        });
      }
    }
  }

  render(): JSX.Element {
    if (this.state.error) {
      return <Error message={this.state.error} />;
    }
    return (
      <div className="users-container">
        <Typography className="users-title" variant="h4" component="h2">
          Users
        </Typography>
        <SelectElements
          styleClass={usersListClass}
          teams={this.state.teams}
          positions={this.state.positions}
          selectedTeam={this.state.selectedTeam}
          selectedPosition={this.state.selectedPosition}
          selectedRole={this.state.selectedRole}
          handleTeamSelect={(value: string) => this.setState({ selectedTeam: value })}
          handlePositionSelect={(value: string) => this.setState({ selectedPosition: value })}
          handleRoleSelect={(value: string) => this.setState({ selectedRole: value })}
        />
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
          data-unit-test="change-button"
        >
          Change selected
        </Button>
      </>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderUsers(): JSX.Element {
    if (this.state.loading) {
      return (
        <div className="circular-progress-container">
          <CircularProgress />
        </div>
      );
    }
    return (
      <>
        {this.state.users.map((el) => (
          <Card
            onClick={() => this.addUserToSelected(el.id)}
            key={el.id}
            className={this.isUserSelected(el.id) ? "users-card users-card-selected" : "users-card"}
            data-unit-test="users-card"
          >
            <CardActionArea>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <Avatar className="users-avatar" alt={el.firstName} src={el.picture} />
                    <Typography variant="h5" className="users-names">
                      {el.firstName} {el.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h5" className="users-names">
                      {el.position ? el.position.position : PositionsEnum.noPosition}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h5" className="users-names">
                      {el.team ? el.team.team : noTeam}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="h5" className="users-names">
                      {el.role}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </>
    );
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
