import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { resolve } from "inversify-react";

import { DateUtil } from "common/DateUtil";
import { HolidayDays, ITextBox, OptionalWithNull } from "common/types";
import { IPTO } from "common/types";
import { ValidationUtil } from "common/ValidationUtil";
import DatesCalculator from "components/common/DatesCalculator/DatesCalculator";
import Error from "components/common/Error/Error";
import PTOForm from "components/NewPTO/PTOForm/PTOForm";
import { IPTOService } from "inversify/interfaces";
import { IHolidayService } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import "./NewPTO.css";

interface NewPTOProps {}

interface NewPTOState {
  startingDate: string;
  endingDate: string;
  holidayDaysStatus: HolidayDays;
  comment: ITextBox;
  approvers: ITextBox;
  warning: string;
  error: boolean;
  formLoading: boolean;
  datesLoading: boolean;
  successMessage: boolean;
}

class NewPTO extends Component<NewPTOProps, NewPTOState> {
  @resolve(TYPES.Holidays) holidaysService!: IHolidayService;
  @resolve(TYPES.PTO) private PTOService!: IPTOService;

  constructor(props: NewPTOProps) {
    super(props);
    this.state = {
      startingDate: DateUtil.todayStringified(),
      endingDate: DateUtil.todayStringified(),
      holidayDaysStatus: [],
      datesLoading: false,
      formLoading: false,
      warning: "",
      comment: {
        value: "PTO",
        isValid: true,
        validate: (value) => value.length >= 1 && value.length <= 1000,
        errorText: "Comment is mandatory.",
        textBoxInvalid: false,
      },
      approvers: {
        value: "",
        isValid: false,
        validate: (value) => value.length > 0 && this.isApproversValid(value),
        errorText: "One or more approvers separated with comma must be provided.",
        textBoxInvalid: false,
      },
      error: false,
      successMessage: false,
    };
  }

  render(): JSX.Element {
    if (this.state.error) {
      return <Error />;
    }
    return (
      <div className="new-pto-container">
        <h1>Add new Paid Time Off</h1>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <PTOForm
              loading={this.state.formLoading}
              warning={this.state.warning}
              successMessage={this.state.successMessage}
              startingDate={this.state.startingDate}
              endingDate={this.state.endingDate}
              comment={this.state.comment}
              approvers={this.state.approvers}
              handleCommentChange={this.handleCommentChange}
              handleApproversChange={this.handleApproversChange}
              setStartingDate={this.setStartingDate}
              setEndingDate={this.setEndingDate}
              addPTO={this.addPTO}
            />
          </Grid>
          <Grid item xs={6}>
            <DatesCalculator holidayDaysStatus={this.state.holidayDaysStatus} loading={this.state.datesLoading} />
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
      datesLoading: true,
    });
    try {
      const holidayDaysStatus = await this.holidaysService.getDatesStatus({
        startingDate,
        endingDate,
      });
      this.setState({
        holidayDaysStatus: holidayDaysStatus,
      });
    } catch (err) {}
    this.setState({
      datesLoading: false,
    });
  };

  addPTO = async (): Promise<void> => {
    if (!this.areInputsValid()) return;
    this.setState({
      formLoading: true,
    });
    try {
      const PTODetails = this.getHoliday();
      const warning = await this.PTOService.addPTO(PTODetails);
      if (warning && warning.warning) {
        this.setState({
          warning: warning.warning,
        });
      } else {
        this.setState({
          successMessage: true,
        });
      }
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
    this.setState({
      formLoading: false,
    });
  };

  private getHoliday(): IPTO {
    const approversArr = this.formatApprovers(this.state.approvers.value);

    return {
      startingDate: this.state.startingDate,
      endingDate: this.state.endingDate,
      comment: this.state.comment.value,
      approvers: approversArr,
    };
  }

  areInputsValid = (): boolean => {
    let areInputsValid = true;
    if (!this.state.comment.isValid) {
      this.setState({
        comment: { ...this.state.comment, textBoxInvalid: true },
        warning: this.state.comment.errorText,
      });
      areInputsValid = false;
    } else {
      this.setState({
        comment: { ...this.state.comment, textBoxInvalid: false },
      });
    }
    if (!this.state.approvers.isValid) {
      this.setState({
        approvers: { ...this.state.approvers, textBoxInvalid: true },
        warning: this.state.approvers.errorText,
      });
      areInputsValid = false;
    } else {
      this.setState({
        approvers: { ...this.state.approvers, textBoxInvalid: false },
      });
    }
    if (this.state.startingDate > this.state.endingDate) {
      this.setState({
        warning: "Starting date must not be after ending date",
      });
      areInputsValid = false;
    }
    return areInputsValid;
  };

  private formatApprovers(approversValue: string): Array<string> {
    return approversValue
      .replace(/ /g, "")
      .split(",")
      .filter((elem) => elem.length > 0);
  }

  private isApproversValid(approversValue: string): boolean {
    const approversArr = this.formatApprovers(approversValue);
    return approversArr.every((el) => ValidationUtil.isEmail(el));
  }

  setStartingDate = async (date: MaterialUiPickersDate, value: OptionalWithNull<string>): Promise<void> => {
    if (value) {
      this.setState({
        datesLoading: true,
      });

      value = value.replaceAll("/", "-");
      this.setState({
        startingDate: value,
      });
      await this.getHolidayDaysStatus(value);
      this.setState({
        datesLoading: false,
      });
    }
  };

  setEndingDate = async (date: MaterialUiPickersDate, value: OptionalWithNull<string>): Promise<void> => {
    if (value) {
      this.setState({
        datesLoading: true,
      });

      value = value.replaceAll("/", "-");
      this.setState({
        endingDate: value,
      });
      await this.getHolidayDaysStatus(this.state.startingDate, value);

      this.setState({
        datesLoading: false,
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
