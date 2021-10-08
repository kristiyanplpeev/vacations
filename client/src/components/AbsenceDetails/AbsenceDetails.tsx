import React, { Component } from "react";

import { CircularProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { resolve } from "inversify-react";
import { RouteComponentProps } from "react-router";

import "./AbsenceDetails.css";
import { dayStatus } from "common/constants";
import { IUserAbsence, IUser, HolidayDays } from "common/interfaces";
import AbsenceCard from "components/AbsenceDetails/AbsenceCard/AbsenceCard";
import DatesCalculator from "components/common/DatesCalculator/DatesCalculator";
import Error from "components/common/Error/Error";
import { IAbsenceService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface AbsenceDetailsMatchProps {
  id: string;
}

interface AbsenceDetailsProps extends RouteComponentProps<AbsenceDetailsMatchProps> {}

interface AbsenceDetailsState {
  error: string;
  loading: boolean;
  absenceDetails: IUserAbsence;
  employee: IUser;
  eachDayStatus: HolidayDays;
  workingDays: number;
}

class AbsenceDetails extends Component<AbsenceDetailsProps, AbsenceDetailsState> {
  @resolve(TYPES.Absence) private absenceService!: IAbsenceService;

  constructor(props: AbsenceDetailsProps) {
    super(props);
    this.state = {
      error: "",
      loading: false,
      employee: {
        id: "",
        googleId: "",
        email: "",
        firstName: "",
        lastName: "",
        picture: "",
      },
      absenceDetails: {
        id: "",
        type: "",
        startingDate: "",
        endingDate: "",
        comment: "",
      },
      eachDayStatus: [],
      workingDays: 0,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      this.setState({
        loading: true,
      });
      const absenceId = this.props.match.params.id;
      const absenceDetails = await this.absenceService.DetailedAbsence(absenceId);
      const workingDays = this.calculateWorkingDays(absenceDetails.eachDayStatus);

      this.setState({
        employee: absenceDetails.employee,
        absenceDetails: {
          id: absenceDetails.id,
          type: absenceDetails.type,
          startingDate: absenceDetails.startingDate,
          endingDate: absenceDetails.endingDate,
          comment: absenceDetails.comment,
        },
        eachDayStatus: absenceDetails.eachDayStatus,
        workingDays,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
    this.setState({
      loading: false,
    });
  }
  render(): JSX.Element {
    if (this.state.error) {
      return <Error message={this.state.error} />;
    }
    return (
      <div className="absence-details-container">
        <h1 className="absence-details-header">View Vacation</h1>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            {this.state.loading ? (
              <CircularProgress />
            ) : (
              <AbsenceCard
                employee={this.state.employee}
                absenceDetails={this.state.absenceDetails}
                workingDays={this.state.workingDays}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            <DatesCalculator
              startingDate={this.state.absenceDetails.startingDate}
              endingDate={this.state.absenceDetails.endingDate}
            />
          </Grid>
        </Grid>
      </div>
    );
  }

  private calculateWorkingDays(daysStatuses: HolidayDays): number {
    return daysStatuses.filter((el) => el.status === dayStatus.workday).length;
  }
}

export default AbsenceDetails;
