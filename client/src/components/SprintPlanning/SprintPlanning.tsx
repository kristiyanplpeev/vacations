import React, { Component } from "react";

import { Button, CircularProgress, Grid } from "@mui/material";
import { resolve } from "inversify-react";
import { RouteComponentProps } from "react-router";

import { DateUtil } from "common/DateUtil";
import { IUserAbsenceWithWorkingDaysAndEmployee } from "common/interfaces";
import Error from "components/common/Error/Error";
import { IAbsenceService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface SprintPlanningProps extends RouteComponentProps {}

interface SprintPlanningState {
  loading: boolean;
  error: string;
  sprintIndex: number;
  absences: Array<IUserAbsenceWithWorkingDaysAndEmployee>;
}

class SprintPlanning extends Component<SprintPlanningProps, SprintPlanningState> {
  @resolve(TYPES.Absence) private absenceService!: IAbsenceService;
  constructor(props: SprintPlanningProps) {
    super(props);

    this.state = {
      loading: false,
      error: "",
      sprintIndex: 0,
      absences: [],
    };
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      loading: true,
    });

    await this.loadAbsences();

    this.setState({
      loading: false,
    });
  }

  async componentDidUpdate(prevProps: SprintPlanningProps, prevState: SprintPlanningState): Promise<void> {
    if (prevState.sprintIndex !== this.state.sprintIndex) {
      this.setState({
        loading: true,
      });
      await this.loadAbsences();
      this.setState({
        loading: false,
      });
    }
  }

  render(): JSX.Element {
    const { error, loading } = this.state;
    if (error) {
      return <Error message={error} />;
    }
    if (loading) {
      return <CircularProgress />;
    }
    return (
      <>
        Sprint Planning
        <Grid container>
          <Grid item>
            <Button onClick={() => this.handleSprintIndexChange(false)}>Prev</Button>
          </Grid>
          <Button onClick={() => this.handleSprintIndexChange(true)}>Next</Button>
        </Grid>
        <div>{this.state.sprintIndex}</div>
      </>
    );
  }

  //   renderCalendars() {}

  async loadAbsences(): Promise<void> {
    try {
      const period = DateUtil.getSprintPeriod(this.state.sprintIndex);
      const startingDate = DateUtil.dateToString(period.startingDate);
      const endingDate = DateUtil.dateToString(period.endingDate);
      const absences = await this.absenceService.getAllUsersAbsences(startingDate, endingDate);
      console.log(startingDate);
      console.log(endingDate);
      this.setState({
        absences,
      });
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }
  }

  handleSprintIndexChange = (showNextSprint: boolean): void => {
    const { sprintIndex } = this.state;

    this.setState({
      sprintIndex: showNextSprint ? sprintIndex + 1 : sprintIndex - 1,
    });
  };
}

export default SprintPlanning;
