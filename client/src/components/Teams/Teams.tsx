import React, { Component } from "react";

import { Grid, Typography, Stack, Paper, Container, Button } from "@mui/material";
import { resolve } from "inversify-react";

import { anyPosition, anyTeam } from "common/constants";
import { ITeams, IUserWithTeamAndPosition } from "common/interfaces";
import { IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

export interface TeamsProps {}

export interface TeamsState {
  loading: boolean;
  error: string;
  teams: Array<ITeams>;
  users: Array<IUserWithTeamAndPosition>;
}

class Teams extends Component<TeamsProps, TeamsState> {
  @resolve(TYPES.user) private userService!: IUserService;

  constructor(props: TeamsProps) {
    super(props);

    this.state = {
      loading: false,
      error: "",
      teams: [],
      users: [],
    };
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      loading: true,
    });

    await this.loadTeams();
    await this.loadUsers();

    this.setState({
      loading: false,
    });
  }

  async loadTeams(): Promise<void> {
    try {
      const teams = await this.userService.getTeams();

      this.setState({
        teams,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  }

  async loadUsers(): Promise<void> {
    try {
      const users = await this.userService.getAllUsers(anyTeam, anyPosition);

      this.setState({
        users,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  }

  render(): JSX.Element {
    return (
      <Container>
        <Typography variant="h2">Teams</Typography>
        <Grid container>{this.renderTeams()}</Grid>
        {this.renderUsers()}
      </Container>
    );
  }

  renderTeams(): JSX.Element {
    return (
      <>
        {this.state.teams.map((team) => (
          <Paper key={team.id} style={{ height: "800px" }}>
            <Typography variant="h3">{team.team}</Typography>
            {this.renderUsers(team.team)}
          </Paper>
        ))}
      </>
    );
  }

  renderUsers(teamName?: string): JSX.Element {
    if (teamName) {
      const filteredUsers = this.state.users.filter((u) => u.team === teamName);
      console.log(filteredUsers);
      return (
        <Stack spacing={2}>
          {filteredUsers.length > 0 ? (
            <>
              {filteredUsers.map((user) => (
                <Grid container key={user.id} justifyContent="space-between">
                  <Grid item>position - todo</Grid>
                  <Grid item>{user.email}</Grid>
                </Grid>
              ))}
            </>
          ) : (
            <>
              <Typography variant="h5">---no employees---</Typography>
              <Button>Delete Team</Button>
            </>
          )}
        </Stack>
      );
    } else {
      const usersWithoutTeam = this.state.users.filter((u) => u.team === "no team");
      return (
        <>
          <Typography variant="h3">Users without a team</Typography>
          <Grid container>
            {usersWithoutTeam.map((user) => (
              <Grid item key={user.id}>
                {user.email}
              </Grid>
            ))}
          </Grid>
        </>
      );
    }
  }
}

export default Teams;
