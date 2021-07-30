/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";

import DateFnsUtils from "@date-io/date-fns";
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
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

import { HolidayDaysInfoType } from "common/types";
import "./DatesCalculator.css";

interface DatesCalculatorProps {
  setStartingDate: (date: MaterialUiPickersDate, value: string | null | undefined) => Promise<void>;
  setEndingDate: (date: MaterialUiPickersDate, value: string | null | undefined) => Promise<void>;
  startingDate: string;
  endingDate: string;
  holidayDaysStatus: HolidayDaysInfoType | null;
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
      const nonWorkingDays = this.props.holidayDaysStatus
        .filter((el) => el.status !== "workday")
        .map((element) => {
          const formattedDate = element.date.replace(/[-]/g, ".");
          return `${formattedDate} - ${element.status}`;
        });
      const numberOfNonWorkingDays = nonWorkingDays.length;
      const totalVacationDays = this.props.holidayDaysStatus.length;
      const numberOfWorkingDays = totalVacationDays - numberOfNonWorkingDays;

      this.setState({
        weekdays: numberOfWorkingDays,
        freeDays: numberOfNonWorkingDays,
        freeDaysStatuses:
          nonWorkingDays.length !== 0 ? nonWorkingDays.join("\r\n") : "There are no free days in that period",
        totalDays: totalVacationDays,
      });
    }
  };

  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          Details
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={12}>
              <KeyboardDatePicker
                className="datescalculator-datepicker"
                margin="normal"
                id="date-picker-dialog"
                label="From:"
                format="yyyy/MM/dd"
                value={this.props.startingDate}
                onChange={(date: MaterialUiPickersDate, value: string | null | undefined) =>
                  this.props.setStartingDate(date, value)
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <KeyboardDatePicker
                className="datescalculator-datepicker"
                margin="normal"
                id="date-picker-dialog"
                label="To:"
                format="yyyy/MM/dd"
                value={this.props.endingDate}
                onChange={(date: MaterialUiPickersDate, value: string | null | undefined) =>
                  this.props.setEndingDate(date, value)
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={6}>
          {this.props.holidayDaysStatus && (
            <TableContainer className="datescalculator-table" component={Paper}>
              <Table className={"table"} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Summary</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={"1"}>
                    <TableCell className="datescalculator-tablecell" align="left">
                      Non- working days:
                    </TableCell>
                    <TableCell className="datescalculator-tablecell" align="left">
                      {this.state.freeDays}
                    </TableCell>
                    <TableCell className="datescalculator-tablecell" align="left">
                      <InfoIcon
                        aria-owns={!!this.state.anchorEl ? "mouse-over-popover" : undefined}
                        aria-haspopup="true"
                        onMouseEnter={(e) => this.handlePopoverOpen(e)}
                        onMouseLeave={() => this.handlePopoverClose()}
                      />
                      <Popover
                        style={{ pointerEvents: "none" }}
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
                        onClose={() => this.handlePopoverClose()}
                        disableRestoreFocus
                      >
                        <Typography style={{ whiteSpace: "pre-wrap" }}>{this.state.freeDaysStatuses}</Typography>
                      </Popover>
                    </TableCell>
                  </TableRow>
                  <TableRow key={"2"}>
                    <TableCell className="datescalculator-tablecell" align="left">
                      Working days:
                    </TableCell>
                    <TableCell className="datescalculator-tablecell" align="left">
                      {this.state.weekdays}
                    </TableCell>
                  </TableRow>
                  <TableRow key={"3"}>
                    <TableCell className="datescalculator-tablecell" align="left">
                      Total:
                    </TableCell>
                    <TableCell className="datescalculator-tablecell" align="left">
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
