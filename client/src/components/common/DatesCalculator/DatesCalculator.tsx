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
import { resolve } from "inversify-react";

import { dayStatus } from "common/constants";
import { HolidayDays } from "common/types";
import "./DatesCalculator.css";
import { IHolidayService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

type calcVacation = {
  nonWorkingDays: Array<string>;
  numberOfNonWorkingDays: number;
  totalVacationDays: number;
  numberOfWorkingDays: number;
};

interface DatesCalculatorProps {
  startingDate: string;
  endingDate: string;
}

interface DatesCalculatorState {
  loading: boolean;
  weekdays: number;
  freeDays: number;
  freeDaysStatuses: string;
  totalDays: number;
  anchorEl: any;
}

class DatesCalculator extends Component<DatesCalculatorProps, DatesCalculatorState> {
  @resolve(TYPES.Holidays) holidaysService!: IHolidayService;

  constructor(props: DatesCalculatorProps) {
    super(props);
    this.state = {
      loading: false,
      weekdays: 0,
      freeDays: 0,
      freeDaysStatuses: "",
      totalDays: 0,
      anchorEl: null,
    };
  }

  async componentDidUpdate(prevProps: DatesCalculatorProps): Promise<void> {
    if (prevProps.startingDate !== this.props.startingDate || prevProps.endingDate !== this.props.endingDate) {
      await this.getHolidayDaysStatus();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    if (this.state.loading) {
      return <CircularProgress />;
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {this.state.totalDays !== 0 && (
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

  getHolidayDaysStatus = async (
    startingDate: string = this.props.startingDate,
    endingDate: string = this.props.endingDate,
  ): Promise<void> => {
    try {
      this.setState({
        loading: true,
      });
      const holidayDaysStatus = await this.holidaysService.getDatesStatus({
        startingDate,
        endingDate,
      });
      const calculatedVacationDays = this.calculateVacationDays(holidayDaysStatus);

      this.setState({
        weekdays: calculatedVacationDays.numberOfWorkingDays,
        freeDays: calculatedVacationDays.numberOfNonWorkingDays,
        freeDaysStatuses:
          calculatedVacationDays.nonWorkingDays.length !== 0
            ? calculatedVacationDays.nonWorkingDays.join("\r\n")
            : "There are no free days in that period",
        totalDays: calculatedVacationDays.totalVacationDays,
        loading: false,
      });
    } catch (err) {}
  };

  private calculateVacationDays(daysStatuses: HolidayDays): calcVacation {
    const nonWorkingDays = daysStatuses
      .filter((el) => el.status !== dayStatus.workday)
      .map((element) => {
        const formattedDate = element.date.replace(/[-]/g, ".");
        return `${formattedDate} - ${element.status}`;
      });
    const numberOfNonWorkingDays = nonWorkingDays.length;
    const totalVacationDays = daysStatuses.length;
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
