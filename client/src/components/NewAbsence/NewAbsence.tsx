import React, { Component } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { resolve } from "inversify-react";
import { RouteComponentProps, StaticContext } from "react-router";

import { AbsencesEnum } from "common/constants";
import { DateUtil } from "common/DateUtil";
import { OptionalWithNull } from "common/interfaces";
import { StringUtil } from "common/StringUtil";
import DatesCalculator from "components/common/DatesCalculator/DatesCalculator";
import Error from "components/common/Error/Error";
import AbsenceFactory from "components/NewAbsence/AbsenceForm/AbsenceForm";
import "./NewAbsence.css";
import { IAbsenceService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

export interface AbsenceFormMatchProps {
  id: string;
  type: string;
}

interface NewAbsenceProps
  extends RouteComponentProps<AbsenceFormMatchProps, StaticContext, { showSnackbar: boolean }> {}

interface NewAbsenceState {
  startingDate: string;
  endingDate: string;
  error: string;
}

class NewAbsence extends Component<NewAbsenceProps, NewAbsenceState> {
  @resolve(TYPES.Absence) protected readonly AbsenceService!: IAbsenceService;

  constructor(props: NewAbsenceProps) {
    super(props);
    this.state = {
      startingDate: DateUtil.todayStringified(),
      endingDate: DateUtil.todayStringified(),
      error: "",
    };
  }

  render(): JSX.Element {
    if (this.state.error) {
      return <Error message={this.state.error} />;
    }
    return (
      <div className="new-absence-container">
        <h1>
          {this.editMode() ? "Edit" : "Add new"} {StringUtil.unzipAbsenceType(this.props.match.params.type)} Leave
        </h1>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Card className="absence-form-paper">
                <CardContent>
                  <Typography className="absence-form-header card-content" variant="h5" component="h2">
                    Details
                  </Typography>
                  {this.renderAbsenceInputs()}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <DatesCalculator startingDate={this.state.startingDate} endingDate={this.state.endingDate} />
          </Grid>
        </Grid>
      </div>
    );
  }

  renderAbsenceInputs(): JSX.Element {
    try {
      const AbsenceInputs = AbsenceFactory.create(this.props.match.params.type);
      return (
        <AbsenceInputs
          startingDate={this.state.startingDate}
          endingDate={this.state.endingDate}
          setStartingDate={this.setStartingDate}
          setEndingDate={this.setEndingDate}
          setError={this.setError}
          editMode={this.editMode}
          history={this.props.history}
          location={this.props.location}
          match={this.props.match}
        />
      );
    } catch (error) {
      this.setError(error.message);
      return <></>;
    }
  }

  //Date | null type is mandatory because of MaterialUI
  setStartingDate = async (
    date: Date | null,
    value: OptionalWithNull<string>,
    isEndDateDisabled: boolean,
    type: AbsencesEnum,
  ): Promise<void> => {
    if (value) {
      this.setState({
        startingDate: value,
      });
    }
    if (isEndDateDisabled && value) {
      try {
        const calculatedEndDate = await this.AbsenceService.getAbsenceEndDate(type, value);
        this.setEndingDate(null, calculatedEndDate.endingDate);
      } catch (error) {
        this.setError(error.message);
      }
    }
  };

  setEndingDate = async (date: Date | null, value: OptionalWithNull<string>): Promise<void> => {
    if (value) {
      this.setState({
        endingDate: value,
      });
    }
  };

  setError = (errorMessage: string): void => {
    this.setState({
      error: errorMessage,
    });
  };

  private editMode = (): boolean => {
    return this.props.match.path === "/edit/:type/:id";
  };
}

export default NewAbsence;
