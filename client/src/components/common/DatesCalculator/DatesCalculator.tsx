/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";

import { dayStatus } from "common/constants";
import { HolidayDaysInfoType } from "common/types";
import "./DatesCalculator.css";

type calcVacation = {
  nonWorkingDays: Array<string>;
  numberOfNonWorkingDays: number;
  totalVacationDays: number;
  numberOfWorkingDays: number;
};

interface DatesCalculatorProps {
  holidayDaysStatus: HolidayDaysInfoType;
  loading: boolean;
}

interface DatesCalculatorState {
  weekdays: number;
  freeDays: number;
  freeDaysStatuses: string;
  totalDays: number;
  anchorEl: any;
}

class DatesCalculator extends Component<DatesCalculatorProps, DatesCalculatorState> {
  constructor(props: DatesCalculatorProps) {
    super(props);
    this.state = {
      weekdays: 0,
      freeDays: 0,
      freeDaysStatuses: "",
      totalDays: 0,
      anchorEl: null,
    };
  }

  componentDidUpdate = (): void => {
    if (this.props.holidayDaysStatus && this.props.holidayDaysStatus.length !== this.state.totalDays) {
      const calculatedVacationDays = this.calculateVacationDays();

      this.setState({
        weekdays: calculatedVacationDays.numberOfWorkingDays,
        freeDays: calculatedVacationDays.numberOfNonWorkingDays,
        freeDaysStatuses:
          calculatedVacationDays.nonWorkingDays.length !== 0
            ? calculatedVacationDays.nonWorkingDays.join("\r\n")
            : "There are no free days in that period",
        totalDays: calculatedVacationDays.totalVacationDays,
      });
    }
  };

  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    if (this.props.loading) {
      return <CircularProgress />;
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {this.props.holidayDaysStatus.length !== 0 && (
            <TableContainer className="dates-calculator-table" component={Paper}>
              <Table className={"table"} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h5" component="h2">
                        Summary
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={"1"}>
                    <TableCell className="dates-calculator-table-cell" align="left">
                      Non- working days:
                    </TableCell>
                    <TableCell className="dates-calculator-table-cell" align="left">
                      {this.state.freeDays}
                    </TableCell>
                    <TableCell className="dates-calculator-table-cell" align="left">
                      <InfoIcon
                        aria-owns={!!this.state.anchorEl ? "mouse-over-popover" : undefined}
                        aria-haspopup="true"
                        onMouseEnter={this.handlePopoverOpen}
                        onMouseLeave={this.handlePopoverClose}
                      />
                      <Popover
                        className="dates-calculator-popover"
                        id="mouse-over-popover"
                        open={Boolean(this.state.anchorEl)}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        onClose={this.handlePopoverClose}
                        disableRestoreFocus
                      >
                        <Typography className="dates-calculator-popover-text">{this.state.freeDaysStatuses}</Typography>
                      </Popover>
                    </TableCell>
                  </TableRow>
                  <TableRow key={"2"}>
                    <TableCell className="dates-calculator-table-cell" align="left">
                      Working days:
                    </TableCell>
                    <TableCell className="dates-calculator-table-cell" align="left">
                      {this.state.weekdays}
                    </TableCell>
                  </TableRow>
                  <TableRow key={"3"}>
                    <TableCell className="dates-calculator-table-cell" align="left">
                      Total:
                    </TableCell>
                    <TableCell className="dates-calculator-table-cell" align="left">
                      {this.state.totalDays}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    );
  }

  private calculateVacationDays(): calcVacation {
    const nonWorkingDays = this.props.holidayDaysStatus
      .filter((el) => el.status !== dayStatus.workday)
      .map((element) => {
        const formattedDate = element.date.replace(/[-]/g, ".");
        return `${formattedDate} - ${element.status}`;
      });
    const numberOfNonWorkingDays = nonWorkingDays.length;
    const totalVacationDays = this.props.holidayDaysStatus.length;
    const numberOfWorkingDays = totalVacationDays - numberOfNonWorkingDays;

    return {
      nonWorkingDays,
      numberOfNonWorkingDays,
      totalVacationDays,
      numberOfWorkingDays,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handlePopoverOpen = (event: any): void => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };
  handlePopoverClose = (): void => {
    this.setState({
      anchorEl: null,
    });
  };
}

export default DatesCalculator;
