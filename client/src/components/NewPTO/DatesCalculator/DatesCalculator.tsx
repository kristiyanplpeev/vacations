import React, { Component } from "react";

import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

interface DatesCalculatorProps {
  setStartingDate: (date: MaterialUiPickersDate, value: string | null | undefined) => Promise<void>;
  setEndingDate: (date: MaterialUiPickersDate, value: string | null | undefined) => Promise<void>;
  startingDate: Date;
  endingDate: Date;
}

interface DatesCalculatorState {}

class DatesCalculator extends Component<DatesCalculatorProps, DatesCalculatorState> {
  render(): JSX.Element {
    return (
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
    );
  }
}

export default DatesCalculator;
