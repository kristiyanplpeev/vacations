import React, { Component } from "react";

import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { resolve } from "inversify-react";

import { HolidayDaysInfoType } from "common/types";
import DatesCalculator from "components/NewPTO/DatesCalculator/DatesCalculator";
import { HolidaysServiceInterface, NewPTOInterface } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface NewPTOProps {}

interface NewPTOState {
  startingDate: Date;
  endingDate: Date;
  holidayDaysStatus: HolidayDaysInfoType | null;
  error: boolean;
}

class NewPTO extends Component<NewPTOProps, NewPTOState> implements NewPTOInterface {
  @resolve(TYPES.Holidays) holidaysService!: HolidaysServiceInterface;

  constructor(props: NewPTOProps) {
    super(props);
    this.state = {
      startingDate: new Date(),
      endingDate: new Date(),
      holidayDaysStatus: null,
      error: false,
    };
  }

  render(): JSX.Element {
    return (
      <div>
        Add mew Paid Time Off
        <DatesCalculator
          startingDate={this.state.startingDate}
          endingDate={this.state.endingDate}
          setStartingDate={this.setStartingDate}
          setEndingDate={this.setEndingDate}
          holidayDaysStatus={this.state.holidayDaysStatus}
        />
      </div>
    );
  }

  getHolidayDaysStatus = async (
    startingDate: Date = this.state.startingDate,
    endingDate: Date = this.state.endingDate,
  ): Promise<void> => {
    try {
      const holidayDaysStatus = await this.holidaysService.getHolidayInfoRequest({
        startingDate,
        endingDate,
      });
      this.setState({
        holidayDaysStatus: holidayDaysStatus,
      });
    } catch (err) {
      this.setState({
        error: true,
      });
    }
  };

  setStartingDate = async (date: MaterialUiPickersDate, value: string | null | undefined): Promise<void> => {
    if (typeof value === "string") {
      const valueAsDate = new Date(value);
      this.setState({
        startingDate: valueAsDate,
      });
      await this.getHolidayDaysStatus(valueAsDate);
    }
  };

  setEndingDate = async (date: MaterialUiPickersDate, value: string | null | undefined): Promise<void> => {
    if (typeof value === "string") {
      const valueAsDate = new Date(value);
      this.setState({
        endingDate: valueAsDate,
      });
      await this.getHolidayDaysStatus(this.state.startingDate, valueAsDate);
    }
  };
}

export default NewPTO;
