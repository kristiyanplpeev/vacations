import React, { Component } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import { resolve } from "inversify-react";
import "./UsersList.css";
import { RouteComponentProps } from "react-router";

import { PositionsEnum, TeamsEnum } from "common/constants";
import { IPositions, ITeams, IUserWithTeamAndPosition } from "common/interfaces";
import Error from "components/common/Error/Error";
import { IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

const anyTeam = "any team";
const anyPosition = "any position";

interface UsersListProps extends RouteComponentProps {}

interface UsersListState {
  error: boolean;
  loading: boolean;
  users: Array<IUserWithTeamAndPosition>;
  selectedUsers: Array<string>;
  teams: Array<ITeams>;
  positions: Array<IPositions>;
  selectedTeam: string;
  selectedPosition: string;
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
      teams: [],
      positions: [],
      selectedTeam: anyTeam,
      selectedPosition: anyPosition,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      this.setState({
        loading: true,
      });
      const users = await this.userService.getAllUsers(anyTeam, anyPosition);
      const teams = await this.userService.getTeams();
      const positions = await this.userService.getPositions();
      this.setState({
        users,
        teams,
        positions,
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
        {this.renderSelectElements()}
        {this.renderChangeButton()}
        {this.renderUsers()}
      </div>
    );
  }

  renderSelectElements(): JSX.Element {
    return (
      <>
        <div className="users-list-selector-wrapper">
          <Typography className="users-list-selector-label" variant="h5" component="h2">
            Team
          </Typography>
          <FormControl className="users-list-selector">
            <Select
              value={this.state.selectedTeam}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                this.handleTeamSelect(event.target.value as string)
              }
            >
              <MenuItem value={anyTeam}>--- any team ---</MenuItem>
              {this.renderTeams()}
              <MenuItem value={TeamsEnum.noTeam}>no team</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="users-list-selector-wrapper">
          <Typography className="users-list-selector-label" variant="h5" component="h2">
            Position
          </Typography>
          <FormControl className="users-list-selector">
            <Select
              value={this.state.selectedPosition}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                this.handlePositionSelect(event.target.value as string)
              }
            >
              <MenuItem value={anyPosition}>--- any position ---</MenuItem>
              {this.renderPositions()}
              <MenuItem value={PositionsEnum.noPosition}>no position</MenuItem>
            </Select>
          </FormControl>
        </div>
      </>
    );
  }

  renderTeams(): Array<JSX.Element> {
    return this.state.teams.map((el) => (
      <MenuItem value={el.id} key={el.id}>
        {el.team}
      </MenuItem>
    ));
  }

  renderPositions(): Array<JSX.Element> {
    return this.state.positions.map((el) => (
      <MenuItem value={el.id} key={el.id}>
        {el.position}
      </MenuItem>
    ));
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

  renderUsers(): Array<JSX.Element> | JSX.Element {
    if (this.state.loading) {
      return <CircularProgress />;
    }
    return this.state.users.map((el) => {
      return (
        <Card
          onClick={() => this.addUserToSelected(el.id)}
          key={el.id}
          className={this.isUserSelected(el.id) ? "users-card users-card-selected" : "users-card"}
          data-unit-test="users-card"
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

  async handleTeamSelect(value: string): Promise<void> {
    try {
      this.setState({
        loading: true,
      });
      const users = await this.userService.getAllUsers(value, this.state.selectedPosition);
      this.setState({
        users,
        selectedTeam: value,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: true,
      });
    }
  }

  async handlePositionSelect(value: string): Promise<void> {
    try {
      this.setState({
        loading: true,
      });
      const users = await this.userService.getAllUsers(this.state.selectedTeam, value);
      this.setState({
        users,
        selectedPosition: value,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: true,
      });
    }
  }
}

export default UsersList;
