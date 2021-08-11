import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { resolve } from "inversify-react";

import DatesCalculator from "common/DatesCalculator/DatesCalculator";
import { ValidationUtil } from "common/emailValidator";
import { HolidayDaysInfoType, TextFieldType } from "common/types";
import AdditionalInfo from "components/NewPTO/AdditionalInfo/AdditionalInfo";
import { HolidaysServiceInterface, NewPTOInterface } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import "./NewPTO.css";

interface NewPTOProps {}

interface NewPTOState {
  startingDate: string;
  endingDate: string;
  holidayDaysStatus: HolidayDaysInfoType;
  comment: TextFieldType;
  approvers: TextFieldType;
  error: boolean;
  loading: boolean;
}

class NewPTO extends Component<NewPTOProps, NewPTOState> implements NewPTOInterface {
  @resolve(TYPES.Holidays) holidaysService!: HolidaysServiceInterface;

  constructor(props: NewPTOProps) {
    super(props);
    this.state = {
      startingDate: new Date().toISOString().slice(0, 10),
      endingDate: new Date().toISOString().slice(0, 10),
      holidayDaysStatus: [],
      loading: false,
      comment: {
        value: "PTO",
        isValid: true,
        validate: (value) => value.length >= 1 && value.length <= 1000,
        errorText: "Comment is mandatory.",
      },
      approvers: {
        value: "",
        isValid: false,
        validate: (value) =>
          value.length > 0 &&
          value
            .replace(/ /g, "")
            .split(",")
            .filter((elem) => elem.length > 0)
            .every((el) => ValidationUtil.isEmail(el)),
        errorText: "One or more approvers separated with comma must be provided.",
      },
      error: false,
    };
  }

  render(): JSX.Element {
    return (
      <div className="newpto-container">
        <h1>Add new Paid Time Off</h1>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <AdditionalInfo
              startingDate={this.state.startingDate}
              endingDate={this.state.endingDate}
              comment={this.state.comment}
              approvers={this.state.approvers}
              handleCommentChange={this.handleCommentChange}
              handleApproversChange={this.handleApproversChange}
              setStartingDate={this.setStartingDate}
              setEndingDate={this.setEndingDate}
            />
          </Grid>
          <Grid item xs={6}>
            <DatesCalculator holidayDaysStatus={this.state.holidayDaysStatus} loading={this.state.loading} />
          </Grid>
        </Grid>
      </div>
    );
  }

  getHolidayDaysStatus = async (
    startingDate: string = this.state.startingDate,
    endingDate: string = this.state.endingDate,
  ): Promise<void> => {
    this.setState({
      loading: true,
    });
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
    this.setState({
      loading: false,
    });
  };

  setStartingDate = async (date: MaterialUiPickersDate, value: string | null | undefined): Promise<void> => {
    if (typeof value === "string") {
      this.setState({
        loading: true,
      });
      try {
        value = value.replaceAll("/", "-");
        this.setState({
          startingDate: value,
        });
        await this.getHolidayDaysStatus(value);
      } catch (error) {
        this.setState({
          error: error.message,
        });
      }
      this.setState({
        loading: false,
      });
    }
  };

  setEndingDate = async (date: MaterialUiPickersDate, value: string | null | undefined): Promise<void> => {
    if (typeof value === "string") {
      this.setState({
        loading: true,
      });
      try {
        value = value.replaceAll("/", "-");
        this.setState({
          endingDate: value,
        });
        await this.getHolidayDaysStatus(this.state.startingDate, value);
      } catch (error) {
        this.setState({
          error: error.message,
        });
      }
      this.setState({
        loading: false,
      });
    }
  };

  handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      comment: {
        ...this.state.comment,
        value: event.target.value,
        isValid: this.state.comment.validate(event.target.value),
      },
    });
  };

  handleApproversChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      approvers: {
        ...this.state.approvers,
        value: event.target.value,
        isValid: this.state.approvers.validate(event.target.value),
      },
    });
  };
}

export default NewPTO;
