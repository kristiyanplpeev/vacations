import React, { Component } from "react";

import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

import { HolidayDaysInfoType } from "common/types";

interface DatesCalculatorProps {
  setStartingDate: (date: MaterialUiPickersDate, value: string | null | undefined) => Promise<void>;
  setEndingDate: (date: MaterialUiPickersDate, value: string | null | undefined) => Promise<void>;
  startingDate: Date;
  endingDate: Date;
  holidayDaysStatus: HolidayDaysInfoType | null;
}

interface DatesCalculatorState {
  weekdays: number;
  freeDays: number;
  freeDaysStatuses: string[];
  totalDays: number;
}

class DatesCalculator extends Component<DatesCalculatorProps, DatesCalculatorState> {
  constructor(props: DatesCalculatorProps) {
    super(props);
    this.state = {
      weekdays: 0,
      freeDays: 0,
      freeDaysStatuses: [],
      totalDays: 0,
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
        freeDaysStatuses: nonWorkingDays,
        totalDays: totalVacationDays,
      });
    }
  };

  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    return (
      <div>
        Details
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
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
          <KeyboardDatePicker
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
        </MuiPickersUtilsProvider>
        {this.props.holidayDaysStatus && (
          <div>
            <div>Summary</div>
            <div>Non- working days: {this.state.freeDays}</div>
            <div>Non-working days reason: {this.state.freeDaysStatuses}</div>
            <div>Working days: {this.state.weekdays}</div>
            <div>Total: {this.state.totalDays}</div>
          </div>
        )}
      </div>
    );
  }
}

export default DatesCalculator;
