import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";

import { DateUtil } from "common/DateUtil";
import { OptionalWithNull } from "common/types";
import DatesCalculator from "components/common/DatesCalculator/DatesCalculator";
import Error from "components/common/Error/Error";
import PTOForm from "components/NewPTO/PTOForm/PTOForm";
import "./NewPTO.css";

interface NewPTOProps {}

interface NewPTOState {
  startingDate: string;
  endingDate: string;
  error: boolean;
}

class NewPTO extends Component<NewPTOProps, NewPTOState> {
  constructor(props: NewPTOProps) {
    super(props);
    this.state = {
      startingDate: DateUtil.todayStringified(),
      endingDate: DateUtil.todayStringified(),
      error: false,
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
              startingDate={this.state.startingDate}
              endingDate={this.state.endingDate}
              setStartingDate={this.setStartingDate}
              setEndingDate={this.setEndingDate}
              setError={this.setError}
            />
          </Grid>
          <Grid item xs={6}>
            <DatesCalculator startingDate={this.state.startingDate} endingDate={this.state.endingDate} />
          </Grid>
        </Grid>
      </div>
    );
  }
  //Date | null type is mandatory because of MaterialUI
  setStartingDate = async (date: Date | null, value: OptionalWithNull<string>): Promise<void> => {
    if (value) {
      value = value.replaceAll("/", "-");
      this.setState({
        startingDate: value,
      });
    }
  };

  setEndingDate = async (date: Date | null, value: OptionalWithNull<string>): Promise<void> => {
    if (value) {
      value = value.replaceAll("/", "-");
      this.setState({
        endingDate: value,
      });
    }
  };

  setError = (errorState: boolean): void => {
    this.setState({
      error: errorState,
    });
  };
}

export default NewPTO;
