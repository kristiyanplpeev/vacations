import React, { Component, ReactNode } from "react";

import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

import { HolidaysServiceInterface, NewPTOInterface } from "inversify/interfaces";
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

interface NewPTOProps {}

interface NewPTOState {
  startingDate: MaterialUiPickersDate;
  endingDate: MaterialUiPickersDate;
}

class NewPTO extends Component<NewPTOProps, NewPTOState> implements NewPTOInterface {
  constructor(props: NewPTOProps) {
    super(props);
    this.state = {
      startingDate: new Date(),
      endingDate: new Date(),
    };
  }

  public holidaysService = myContainer.get<HolidaysServiceInterface>(TYPES.Holidays);

  componentDidUpdate = async (): Promise<void> => {
    console.log("what is going on");
    const holidayDaysStatus = await this.holidaysService.getHolidayInfoRequest({
      startingDate: this.state.startingDate,
      endingDate: this.state.endingDate,
    });
    console.log(holidayDaysStatus);
  };

  render(): ReactNode {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date picker dialog"
          format="yyyy/MM/dd"
          value={this.state.startingDate}
          onChange={(date: MaterialUiPickersDate) => this.setStartingDate(date)}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date picker dialog"
          format="yyyy/MM/dd"
          value={this.state.endingDate}
          onChange={(date: MaterialUiPickersDate) => this.setEndingDate(date)}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }

  setStartingDate = async (date: MaterialUiPickersDate): Promise<void> => {
    this.setState({
      startingDate: date,
    });
  };

  setEndingDate = async (date: MaterialUiPickersDate): Promise<void> => {
    console.log(date);
    this.setState({
      endingDate: date,
    });
  };
}

export default NewPTO;
