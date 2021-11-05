import React, { Component } from "react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import "./TeamCapacityTable.css";
import { resolve } from "inversify-react";
import { connect } from "react-redux";

import { anyPosition, anyRole, PositionsEnum } from "common/constants";
import { IUserWithTeamAndPosition } from "common/interfaces";
import { IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import { ApplicationState, IUserState } from "store/user/types";

interface TeamCapacityTableProps {
  userState: IUserState;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
}

interface TeamCapacityTableState {
  teamMembers: Array<IUserWithTeamAndPosition>;
}

class TeamCapacityTable extends Component<TeamCapacityTableProps, TeamCapacityTableState> {
  @resolve(TYPES.user) private usersService!: IUserService;

  constructor(props: TeamCapacityTableProps) {
    super(props);

    this.state = {
      teamMembers: [],
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      this.props.setLoading(true);
      const teamMembers = await this.usersService.getFilteredUsers(
        this.props.userState.userDetails.team.id,
        anyPosition,
        anyRole,
      );
      this.setState({
        teamMembers,
      });
      this.props.setLoading(false);
    } catch (error) {
      this.props.setError(error.message);
    }
  }

  render(): JSX.Element {
    console.log(this.sortTeamMembers());
    return (
      <div className="team-capacity-table-container">
        <Typography variant="h4" className="calculated-sprint-capacity">
          Capacity 15.25 story points
        </Typography>
        {this.renderTable()}
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
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
          <TableCell align="left">
            <b>email</b>
          </TableCell>
          <TableCell align="left">
            <b>absences</b>
          </TableCell>
          <TableCell align="left">
            <b>workdays</b>
          </TableCell>
          <TableCell align="left">
            <b>coefficient</b>
          </TableCell>
          <TableCell align="left">
            <b>capacity</b>
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }
  renderTableBody(): Array<JSX.Element> {
    return this.sortTeamMembers().map((member) => (
      <TableRow key={member.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row">
          {member.position ? member.position.position : PositionsEnum.noPosition}
        </TableCell>
        <TableCell align="left">{member.email}</TableCell>
        <TableCell align="left">not ready</TableCell>
        <TableCell align="left">not ready</TableCell>
        <TableCell align="left">{member.position ? member.position.coefficient : 0}</TableCell>
        <TableCell align="left">not ready</TableCell>
      </TableRow>
    ));
  }

  renderTableFooter(): JSX.Element {
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
          <b>15.25</b>
        </TableCell>
      </TableRow>
    );
  }

  sortTeamMembers(): Array<IUserWithTeamAndPosition> {
    return this.state.teamMembers
      .map((teamMember) =>
        teamMember.position
          ? teamMember
          : { ...teamMember, position: { id: "", position: PositionsEnum.noPosition, coefficient: 0, sortOrder: 15 } },
      )
      .sort((a, b) => {
        console.log(1);
        if (a.position.sortOrder > b.position.sortOrder) {
          return 1;
        } else if (a.position.sortOrder < b.position.sortOrder) {
          return -1;
        } else if (a.email < b.email) {
          return 1;
        } else if (a.email > b.email) {
          return -1;
        } else {
          return 0;
        }
      });
  }
}
const mapStateToProps = ({ userInfoReducer }: ApplicationState) => {
  return {
    userState: userInfoReducer,
  };
};

export default connect(mapStateToProps)(TeamCapacityTable);
