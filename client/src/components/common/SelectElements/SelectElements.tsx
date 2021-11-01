import React, { Component } from "react";

import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

import {
  anyPosition,
  anyRole,
  anyTeam,
  noChange,
  PositionsEnum,
  TeamsEnum,
  UserRolesEnum,
  usersListClass,
} from "common/constants";
import { IPositions, ITeams } from "common/interfaces";

interface SelectElementsProps {
  styleClass: string;
  teams: Array<ITeams>;
  positions: Array<IPositions>;
  selectedTeam: string;
  selectedPosition: string;
  selectedRole: string;
  handleTeamSelect: (value: string) => Promise<void>;
  handlePositionSelect: (value: string) => Promise<void>;
  handleRoleSelect: (value: string) => Promise<void>;
}

class SelectElements extends Component<SelectElementsProps> {
  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    const { styleClass } = this.props;
    return (
      <>
        <div className={`${styleClass}-selector-wrapper`}>
          <Typography className={`${styleClass}-selector-label`} variant="h5">
            Team
          </Typography>
          <FormControl className={`${styleClass}-selector`}>
            <Select
              value={this.props.selectedTeam}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                this.props.handleTeamSelect(event.target.value as string)
              }
            >
              {styleClass === usersListClass ? (
                <MenuItem value={anyTeam}>--- any team ---</MenuItem>
              ) : (
                <MenuItem value={noChange}>--- no change ---</MenuItem>
              )}
              {this.renderTeams()}
              <MenuItem value={TeamsEnum.noTeam}>no team</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={`${styleClass}-selector-wrapper`}>
          <Typography className={`${styleClass}-selector-label`} variant="h5">
            Position
          </Typography>
          <FormControl className={`${styleClass}-selector`}>
            <Select
              defaultValue={this.props.selectedPosition}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                this.props.handlePositionSelect(event.target.value as string)
              }
            >
              {styleClass === usersListClass ? (
                <MenuItem value={anyPosition}>--- any position ---</MenuItem>
              ) : (
                <MenuItem value={noChange}>--- no change ---</MenuItem>
              )}
              {this.renderPositions()}
              <MenuItem value={PositionsEnum.noPosition}>no position</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={`${styleClass}-selector-wrapper`}>
          <Typography className={`${styleClass}-selector-label`} variant="h5">
            Role
          </Typography>
          <FormControl className={`${styleClass}-selector`}>
            <Select
              value={this.props.selectedRole}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                this.props.handleRoleSelect(event.target.value as string)
              }
            >
              {styleClass === usersListClass ? (
                <MenuItem value={anyRole}>--- any role ---</MenuItem>
              ) : (
                <MenuItem value={noChange}>--- no change ---</MenuItem>
              )}
              {this.renderRoles()}
            </Select>
          </FormControl>
        </div>
      </>
    );
  }

  renderTeams(): Array<JSX.Element> {
    return this.props.teams.map((el) => (
      <MenuItem value={el.id} key={el.id}>
        {el.team}
      </MenuItem>
    ));
  }

  renderPositions(): Array<JSX.Element> {
    return this.props.positions.map((el) => (
      <MenuItem value={el.id} key={el.id}>
        {el.position}
      </MenuItem>
    ));
  }

  renderRoles(): Array<JSX.Element> {
    return Object.values(UserRolesEnum).map((el) => (
      <MenuItem value={el} key={el}>
        {el}
      </MenuItem>
    ));
  }
}

export default SelectElements;
