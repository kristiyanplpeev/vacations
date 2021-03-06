import React, { Component } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import "./TeamCapacityTable.css";

import { PositionsEnum, sprintPlanningTableColumns } from "common/constants";
import { IUserAbsenceWithWorkingDaysAndEmployee, IUserWithTeamAndPosition } from "common/interfaces";

interface TeamCapacityTableDetails {
  absences: number;
  workdays: number;
  coefficient: number;
  capacity: number;
}

interface TeamCapacityTableProps {
  setError: (error: string) => void;
  teamMembers: Array<IUserWithTeamAndPosition>;
  absences: Array<IUserAbsenceWithWorkingDaysAndEmployee>;
  absenceDays: Map<string, number>;
  sprintTotalWorkdays: number;
}

interface TeamCapacityTableState {
  loading: boolean;
}

class TeamCapacityTable extends Component<TeamCapacityTableProps, TeamCapacityTableState> {
  constructor(props: TeamCapacityTableProps) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render(): JSX.Element {
    if (this.state.loading) {
      return <CircularProgress />;
    }
    const totalCapacity = this.calculateTotalCapacity();

    return (
      <div className="team-capacity-table-container">
        <Typography variant="h2" className="calculated-sprint-capacity">
          Capacity {totalCapacity} story points
        </Typography>
        {this.renderTable()}
      </div>
    );
  }

  renderTable(): JSX.Element {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          {this.renderTableHead()}
          <TableBody>
            {this.renderTableBody()}
            {this.renderTableFooter()}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  renderTableHead(): JSX.Element {
    return (
      <TableHead>
        <TableRow>
          <TableCell>
            <b>Position</b>
          </TableCell>
          {sprintPlanningTableColumns.map((c, index) => (
            <TableCell key={index} align="left">
              <b>{c}</b>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  renderTableBody(): Array<JSX.Element> {
    return this.sortTeamMembers().map((member) => {
      const { absences, workdays, coefficient, capacity } = this.getDetails(member);
      return (
        <TableRow key={member.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
          <TableCell component="th" scope="row">
            {member.position ? member.position.position : PositionsEnum.noPosition}
          </TableCell>
          <TableCell align="left">{member.email}</TableCell>
          <TableCell align="left">{absences}</TableCell>
          <TableCell align="left">{workdays}</TableCell>
          <TableCell align="left">{coefficient}</TableCell>
          <TableCell align="left">{capacity}</TableCell>
        </TableRow>
      );
    });
  }

  renderTableFooter(): JSX.Element {
    const totalCapacity = this.calculateTotalCapacity();

    return (
      <TableRow>
        <TableCell align="left"></TableCell>
        <TableCell align="left"></TableCell>
        <TableCell align="left"></TableCell>
        <TableCell align="left"></TableCell>
        <TableCell align="left">
          <b>Total</b>
        </TableCell>
        <TableCell align="left">
          <b>{totalCapacity}</b>
        </TableCell>
      </TableRow>
    );
  }

  getDetails(teamMember: IUserWithTeamAndPosition): TeamCapacityTableDetails {
    const absences = this.props.absenceDays.get(teamMember.id);

    if (absences === undefined) {
      throw new Error(`User with id ${teamMember.id} does not exist`);
    }

    const workdays = this.props.sprintTotalWorkdays - absences;
    const coefficient = teamMember.position ? teamMember.position.coefficient : 0;
    const capacity = +(workdays * coefficient).toFixed(2);

    return { absences, workdays, coefficient, capacity };
  }

  calculateTotalCapacity(): number {
    return +this.props.teamMembers
      .reduce((totalCapacity, member) => {
        const { capacity } = this.getDetails(member);

        return (totalCapacity += capacity);
      }, 0)
      .toFixed(2);
  }

  sortTeamMembers(): Array<IUserWithTeamAndPosition> {
    return this.props.teamMembers
      .map((teamMember) =>
        teamMember.position
          ? teamMember
          : { ...teamMember, position: { id: "", position: PositionsEnum.noPosition, coefficient: 0, sortOrder: 15 } },
      )
      .sort(
        (a, b) =>
          a.position.sortOrder - b.position.sortOrder || (a.email.toUpperCase() < b.email.toUpperCase() ? -1 : 1),
      );
  }
}

export default TeamCapacityTable;
