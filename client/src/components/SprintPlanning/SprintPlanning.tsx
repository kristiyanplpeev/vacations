import React, { Component } from "react";

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { Button, CircularProgress, Grid } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { compareAsc } from "date-fns/esm";
import { resolve } from "inversify-react";
import { RouteComponentProps } from "react-router";

import { firstSprintBeginning, noDataError } from "common/constants";
import { DateUtil } from "common/DateUtil";
import { IUserAbsenceWithWorkingDaysAndEmployee, SprintPeriod } from "common/interfaces";
import Error from "components/common/Error/Error";
import TeamCapacityTable from "components/SprintPlanning/TeamCapacityTable/TeamCapacityTable";
import { IAbsenceService, IHolidayService, ISprintPlanningService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

import "./SprintPlanning.css";

interface SprintPlanningProps extends RouteComponentProps {}

interface SprintPlanningState {
  loading: boolean;
  error: string;
  sprintIndex: number;
  sprintPeriod: SprintPeriod;
  sprintTotalWorkdays: number;
  absences: Array<IUserAbsenceWithWorkingDaysAndEmployee>;
  disablePrevButton: boolean;
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
      disablePrevButton: false,
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
    const { error } = this.state;
    if (error) {
      return <Error message={error} />;
    }

    return (
      <div className="sprint-planning-container">
        {this.renderHeader()}
        <TeamCapacityTable />
      </div>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderHeader(): JSX.Element {
    const { startingDate, endingDate } = this.state.sprintPeriod;

    const sprintStartDDMMYYYY = DateUtil.formatDateDDMMYYYY(startingDate);
    const sprintEndDDMMYYYY = DateUtil.formatDateDDMMYYYY(endingDate);
    return (
      <Grid container spacing={3}>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <Tooltip
            arrow
            title={this.state.disablePrevButton ? noDataError : ""}
            placement="bottom"
            style={{ padding: "1px" }}
          >
            <span>
              <Button
                variant="outlined"
                disabled={this.state.disablePrevButton}
                onClick={() => this.handleSprintIndexChange(false)}
                startIcon={<DoubleArrowIcon className="double-arrow" />}
              >
                Prev
              </Button>
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={4}>
          {this.state.loading ? (
            <CircularProgress />
          ) : (
            <Typography variant="h5">
              Sprint ({sprintStartDDMMYYYY} - {sprintEndDDMMYYYY})
            </Typography>
          )}
        </Grid>
        <Grid item xs={2}>
          <Button variant="outlined" onClick={() => this.handleSprintIndexChange(true)} endIcon={<DoubleArrowIcon />}>
            Next
          </Button>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    );
  }

  //   renderCalendars() {}

  async loadAbsences(): Promise<void> {
    try {
      const period = DateUtil.getSprintPeriod(this.state.sprintIndex);

      if (compareAsc(period.startingDate, firstSprintBeginning) === 0) {
        this.setState({
          disablePrevButton: true,
        });
      } else {
        this.setState({
          disablePrevButton: false,
        });
      }

      const { startingDate, endingDate } = this.sprintPlanningService.convertSprintPeriodDatesToStrings(period);
      const absences = await this.absenceService.getAllUsersAbsences(startingDate, endingDate);

      this.setState({
        sprintPeriod: period,
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
