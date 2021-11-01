import React, { Component } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { resolve } from "inversify-react";
import { RouteComponentProps } from "react-router";

import { bulkChangeUsersClass, noChange } from "common/constants";
import { IPositions, ITeams, IUserWithTeamAndPosition } from "common/interfaces";
import Error from "components/common/Error/Error";
import SelectElements from "components/common/SelectElements/SelectElements";
import { IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import "./BulkChangeUsers.css";

interface BulkChangeUsersMatchProps {
  ids: string;
}

interface BulkChangeUsersProps extends RouteComponentProps<BulkChangeUsersMatchProps> {}

interface BulkChangeUsersState {
  error: string;
  loading: boolean;
  users: Array<IUserWithTeamAndPosition>;
  teams: Array<ITeams>;
  positions: Array<IPositions>;
  selectedTeam: string;
  selectedPosition: string;
  selectedRole: string;
}

class BulkChangeUsers extends Component<BulkChangeUsersProps, BulkChangeUsersState> {
  @resolve(TYPES.user) private userService!: IUserService;

  constructor(props: BulkChangeUsersProps) {
    super(props);
    this.state = {
      error: "",
      loading: false,
      users: [],
      teams: [],
      positions: [],
      selectedTeam: noChange,
      selectedPosition: noChange,
      selectedRole: noChange,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      this.setState({
        loading: true,
      });
      const userIds = this.props.match.params.ids.replaceAll("&", ",");
      const users = await this.userService.getUsersByIds(userIds);
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

  render(): JSX.Element {
    const numberOfUsers = this.state.users.length;
    if (this.state.error) {
      return <Error message={this.state.error} />;
    }
    if (this.state.loading) {
      return <CircularProgress />;
    }
    return (
      <div className="change-bulk-container">
        <Typography className="change-bulk-title" variant="h4" component="h2">
          Bulk change {numberOfUsers} user{numberOfUsers > 1 && "s"}
        </Typography>
        {this.renderUsers()}
        <Typography className="change-bulk-new-values" variant="h4" component="h2">
          New values
        </Typography>
        <SelectElements
          styleClass={bulkChangeUsersClass}
          teams={this.state.teams}
          positions={this.state.positions}
          selectedTeam={this.state.selectedTeam}
          selectedPosition={this.state.selectedPosition}
          selectedRole={this.state.selectedRole}
          handleTeamSelect={(value: string) => this.setState({ selectedTeam: value })}
          handlePositionSelect={(value: string) => this.setState({ selectedPosition: value })}
          handleRoleSelect={(value: string) => this.setState({ selectedRole: value })}
        />
        <Divider className="change-bulk-divider" />
        {this.renderButtons()}
      </div>
    );
  }

  renderUsers(): Array<JSX.Element> {
    return this.state.users.map((el) => {
      return (
        <Card key={el.id} className="change-bulk-card">
          <CardActionArea disabled>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <Avatar className="change-bulk-avatar" alt={el.firstName} src={el.picture} />
                  <Typography variant="h5" className="change-bulk-names">
                    {el.firstName} {el.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" className="change-bulk-names">
                    {el.position}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" className="change-bulk-names">
                    {el.team}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="h5" className="change-bulk-names">
                    {el.role}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      );
    });
  }

  renderButtons(): JSX.Element {
    return (
      <div className="change-bulk-buttons-container">
        <Button
          className="change-bulk-buttons"
          variant="outlined"
          color="secondary"
          onClick={() => this.props.history.push("/admin/users")}
        >
          Cancel
        </Button>
        <Button className="change-bulk-buttons" variant="outlined" color="primary" onClick={() => this.updateUser()}>
          Apply
        </Button>
      </div>
    );
  }

  async updateUser(): Promise<void> {
    try {
      this.setState({
        loading: true,
      });
      const usersIds = this.state.users.map((el) => el.id);
      if (this.state.selectedTeam !== noChange) {
        await this.userService.updateUsersTeam(usersIds, this.state.selectedTeam);
      }

      if (this.state.selectedPosition !== noChange) {
        await this.userService.updateUsersPosition(usersIds, this.state.selectedPosition);
      }

      if (this.state.selectedRole !== noChange) {
        await this.userService.updateUsersRole(usersIds, this.state.selectedRole);
      }

      this.props.history.push("/admin/users");
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  }
}

export default BulkChangeUsers;
