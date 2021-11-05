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

interface TeamCapacityTableProps {}

interface TeamCapacityTableState {}

class TeamCapacityTable extends Component<TeamCapacityTableProps, TeamCapacityTableState> {
  render(): JSX.Element {
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
    const rows = [{ name: "ivan", calories: "ivanivanovivanov@atscale.com", fat: "very", carbs: 5, protein: "50g" }];

    return rows.map((row) => (
      <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="left">{row.calories}</TableCell>
        <TableCell align="left">{row.fat}</TableCell>
        <TableCell align="left">{row.carbs}</TableCell>
        <TableCell align="left">{row.protein}</TableCell>
        <TableCell align="left">{row.protein}</TableCell>
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
}

export default TeamCapacityTable;
