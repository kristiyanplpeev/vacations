import React, { Component } from "react";

import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

import DatesCalculator from "components/NewPTO/DatesCalculator/DatesCalculator";
import { HolidaysServiceInterface, NewPTOInterface } from "inversify/interfaces";
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

interface NewPTOProps {}

interface NewPTOState {
  startingDate: Date;
  endingDate: Date;
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
    console.log(this.state.startingDate);
    try {
      const holidayDaysStatus = await this.holidaysService.getHolidayInfoRequest({
        startingDate: this.state.startingDate,
        endingDate: this.state.endingDate,
      });
      console.log(holidayDaysStatus);
    } catch (err) {
      console.log(err.message);
    }
  };

  render(): JSX.Element {
    return (
      <div>
        <DatesCalculator
          startingDate={this.state.startingDate}
          endingDate={this.state.endingDate}
          setStartingDate={this.setStartingDate}
          setEndingDate={this.setEndingDate}
        />
      </div>
    );
  }

  setStartingDate = async (date: MaterialUiPickersDate, value: string | null | undefined): Promise<void> => {
    if (typeof value === "string") {
      this.setState({
        startingDate: new Date(value),
      });
    }
  };

  setEndingDate = async (date: MaterialUiPickersDate, value: string | null | undefined): Promise<void> => {
    if (typeof value === "string") {
      this.setState({
        endingDate: new Date(value),
      });
    }
  };
}

export default NewPTO;
