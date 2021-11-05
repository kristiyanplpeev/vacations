import React, { Component } from "react";

import { Button, CircularProgress, Grid } from "@mui/material";
import { resolve } from "inversify-react";
import { RouteComponentProps } from "react-router";

import { DateUtil } from "common/DateUtil";
import { IUserAbsenceWithWorkingDaysAndEmployee, SprintPeriod } from "common/interfaces";
import Error from "components/common/Error/Error";
import { IAbsenceService, IHolidayService, ISprintPlanningService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface SprintPlanningProps extends RouteComponentProps {}

interface SprintPlanningState {
  loading: boolean;
  error: string;
  sprintIndex: number;
  sprintPeriod: SprintPeriod;
  sprintTotalWorkdays: number;
  absences: Array<IUserAbsenceWithWorkingDaysAndEmployee>;
}

class SprintPlanning extends Component<SprintPlanningProps, SprintPlanningState> {
  @resolve(TYPES.SprintPlanning) private sprintPlanningService!: ISprintPlanningService;
  @resolve(TYPES.Absence) private absenceService!: IAbsenceService;
  @resolve(TYPES.Holidays) private holidayService!: IHolidayService;

  constructor(props: SprintPlanningProps) {
    super(props);

    this.state = {
      loading: false,
      error: "",
      sprintIndex: 0,
      sprintPeriod: {
        startingDate: new Date(),
        endingDate: new Date(),
      },
      sprintTotalWorkdays: 10,
      absences: [],
    };
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      loading: true,
    });

    await this.loadAbsences();
    await this.loadTotalWorkdaysForCurrentSprint();

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
      await this.loadTotalWorkdaysForCurrentSprint();

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
    console.log(this.state.sprintTotalWorkdays);
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
      const sprintPeriod = DateUtil.getSprintPeriod(this.state.sprintIndex);
      const startingDate = DateUtil.dateToString(sprintPeriod.startingDate);
      const endingDate = DateUtil.dateToString(sprintPeriod.endingDate);
      const absences = await this.absenceService.getAllUsersAbsences(startingDate, endingDate);
      this.setState({
        sprintPeriod,
        absences,
      });
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }
  }

  async loadTotalWorkdaysForCurrentSprint(): Promise<void> {
    try {
      const sprintPeriodStringified = this.sprintPlanningService.convertSprintPeriodDatesToStrings(
        this.state.sprintPeriod,
      );
      const totalDays = await this.holidayService.getDatesStatus(sprintPeriodStringified);
      const sprintTotalWorkdays = this.sprintPlanningService.calculateTotalWorkdays(totalDays);

      this.setState({
        sprintTotalWorkdays,
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
