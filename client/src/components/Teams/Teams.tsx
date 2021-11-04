import React, { Component } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Grid,
  Typography,
  Stack,
  Paper,
  Container,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Divider,
  Modal,
  Box,
  CircularProgress,
} from "@mui/material";
import { resolve } from "inversify-react";

import { PositionsEnum } from "common/constants";
import { ITeams, IUserWithTeamAndPosition } from "common/interfaces";
import Error from "components/common/Error/Error";
import { IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import "./Teams.css";

export interface TeamsProps {}

export interface TeamsState {
  loading: boolean;
  error: string;
  openAddDialog: boolean;
  openDeleteModal: boolean;
  teamName: string;
  teamNameError: string;
  teamToDeleteId: string;
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
      openAddDialog: false,
      openDeleteModal: false,
      teamName: "",
      teamNameError: "",
      teamToDeleteId: "",
      teams: [],
      users: [],
    };
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      loading: true,
    });

    await Promise.all([this.loadTeams(), this.loadUsers()]);

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
      const users = await this.userService.getAllUsers();
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
    const { error, loading } = this.state;
    if (error) {
      return <Error message={error} />;
    }
    if (loading) {
      return <CircularProgress />;
    }

    return (
      <Container className="teams-page-container">
        <Typography variant="h2">Teams</Typography>
        {this.renderAddTeam()}
        {this.renderTeams()}
        {this.renderUsersWithoutTeam()}
        {this.renderModal()}
      </Container>
    );
  }

  renderAddTeam(): JSX.Element {
    const { openAddDialog, teamName, teamNameError } = this.state;
    return (
      <>
        <Button startIcon={<AddIcon />} onClick={this.handleClickOpen} variant="outlined">
          Add Team
        </Button>
        <Dialog open={openAddDialog} onClose={this.handleClose}>
          <DialogTitle>Add Team</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter the name of the team!</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              value={teamName}
              fullWidth
              variant="standard"
              onChange={this.handleTeamNameChange}
              error={!!teamNameError}
              helperText={teamNameError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Cancel</Button>
            <Button onClick={this.handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  renderTeams(): JSX.Element {
    return (
      <Grid container>
        {this.state.teams.map((team) => (
          <Grid key={team.id} item xs={6}>
            <Paper variant="outlined" className="team-container">
              <Typography variant="h4">{team.team}</Typography>
              <Divider className="divider" />
              {this.renderUsersWithTeam(team)}
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }

  renderUsersWithTeam(team: ITeams): JSX.Element {
    const filteredUsers = this.state.users.filter((u) => u.team?.team === team.team);
    const sortedUsers = this.getSortedUsers(filteredUsers);
    return (
      <Stack spacing={2}>
        {sortedUsers.length > 0 ? (
          <>
            {sortedUsers.map((user) => {
              const position = user.position ? user.position.position : PositionsEnum.noPosition;
              return (
                <Grid container key={user.id} justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Chip
                      className="teams-card-chip"
                      avatar={<Avatar className="teams-card-chip-avatar" alt={user.firstName[0]} src={user.picture} />}
                      label={position}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>{user.email}</Grid>
                </Grid>
              );
            })}
          </>
        ) : (
          <Stack spacing={8} className="empty-team">
            <Typography variant="h5">---no employees---</Typography>
            <Button
              startIcon={<DeleteIcon />}
              variant="contained"
              className="delete-team-button"
              onClick={() => this.handleDeleteModalOpen(team.id)}
            >
              Delete Team
            </Button>
          </Stack>
        )}
      </Stack>
    );
  }

  renderUsersWithoutTeam(): JSX.Element {
    const usersWithoutTeam = this.state.users.filter((u) => !u.team);
    return (
      <Stack spacing={2}>
        <Typography variant="h3" align="left">
          Users without a team
        </Typography>
        <Grid container spacing={2} className="users-without-team" alignContent="center" alignItems="center">
          {usersWithoutTeam.map((user) => (
            <Grid item key={user.id} xs={4}>
              <Chip
                className="teams-card-chip"
                avatar={<Avatar className="teams-card-chip-avatar" alt={user.firstName[0]} src={user.picture} />}
                label={user.email}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    );
  }

  renderModal(): JSX.Element {
    const { openDeleteModal, teamToDeleteId } = this.state;
    return (
      <Modal open={openDeleteModal}>
        <Box className="confirmation-modal">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to delete this team?
          </Typography>
          <Button variant="outlined" className="modal-buttons" onClick={() => this.handleDelete(teamToDeleteId)}>
            Confirm
          </Button>
          <Button variant="outlined" color="error" className="modal-buttons" onClick={this.handleDeleteModalClose}>
            Cancel
          </Button>
        </Box>
      </Modal>
    );
  }

  getSortedUsers(users: Array<IUserWithTeamAndPosition>): Array<IUserWithTeamAndPosition> {
    return [...users].sort((a, b) => (b.position ? a.position.sortOrder - b.position.sortOrder : -1));
  }

  handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    this.setState({
      teamName: value,
    });
  };

  checkForTeamNameError = (): boolean => {
    const { teams, teamName } = this.state;
    if (!teamName || teamName.length < 3 || teamName.length > 50) {
      this.setState({
        teamNameError: "Please enter a name between 3 and 50 characters",
      });

      return true;
    }

    const teamNames = teams.map((t) => t.team);
    const nameAlreadyExists = teamNames.some((team) => team.toLowerCase().trim() === teamName.toLowerCase().trim());
    if (nameAlreadyExists) {
      this.setState({
        teamNameError: "This team name already exists!",
      });

      return true;
    }

    return false;
  };

  handleDelete = async (teamId: string): Promise<void> => {
    try {
      await this.userService.deleteTeam(teamId);
      await this.loadTeams();
      this.handleDeleteModalClose();
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }
  };

  handleSubmit = async (): Promise<void> => {
    try {
      const hasError = this.checkForTeamNameError();
      if (hasError) {
        return;
      }

      await this.userService.postTeam(this.state.teamName);
      await this.loadTeams();
      this.handleClose();
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }
  };

  handleDeleteModalOpen = (teamId: string): void => {
    this.setState({
      openDeleteModal: true,
      teamToDeleteId: teamId,
    });
  };

  handleDeleteModalClose = (): void => {
    this.setState({
      openDeleteModal: false,
      teamToDeleteId: "",
    });
  };

  handleClickOpen = (): void => {
    this.setState({
      openAddDialog: true,
    });
  };

  handleClose = (): void => {
    this.setState({
      openAddDialog: false,
      teamName: "",
      teamNameError: "",
    });
  };
}

export default Teams;
