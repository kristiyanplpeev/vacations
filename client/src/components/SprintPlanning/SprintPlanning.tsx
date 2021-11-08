import React, { Component } from "react";

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { Button, CircularProgress, Grid } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { compareAsc } from "date-fns/esm";
import { resolve } from "inversify-react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

import { anyPosition, anyRole, firstSprintBeginning, noDataError } from "common/constants";
import { DateUtil } from "common/DateUtil";
import {
  HolidayDays,
  IUserAbsenceWithWorkingDaysAndEmployee,
  IUserWithTeamAndPosition,
  SprintPeriod,
} from "common/interfaces";
import Error from "components/common/Error/Error";
import AbsenceOverview from "components/SprintPlanning/AbsenceOverview/AbsenceOverview";
import TeamCapacityTable from "components/SprintPlanning/TeamCapacityTable/TeamCapacityTable";
import { IAbsenceService, IHolidayService, ISprintPlanningService, IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import "./SprintPlanning.css";
import { ApplicationState, IUserState } from "store/user/types";

interface SprintPlanningProps extends RouteComponentProps {
  userState: IUserState;
}

interface SprintPlanningState {
  loading: boolean;
  error: string;
  sprintIndex: number;
  sprintPeriod: SprintPeriod;
  sprintTotalWorkdays: number;
  sprintEachDayWithStatus: HolidayDays;
  absences: Array<IUserAbsenceWithWorkingDaysAndEmployee>;
  teamMembers: Array<IUserWithTeamAndPosition>;
  absenceDays: Map<string, number>;
  disablePrevButton: boolean;
}

class SprintPlanning extends Component<SprintPlanningProps, SprintPlanningState> {
  @resolve(TYPES.user) private userService!: IUserService;
  @resolve(TYPES.SprintPlanning) private sprintPlanningService!: ISprintPlanningService;
  @resolve(TYPES.Absence) private absenceService!: IAbsenceService;
  @resolve(TYPES.Holidays) private holidayService!: IHolidayService;

  constructor(props: SprintPlanningProps) {
    super(props);

    this.state = {
      loading: true,
      error: "",
      sprintIndex: 0,
      sprintPeriod: {
        startingDate: new Date(),
        endingDate: new Date(),
      },
      sprintTotalWorkdays: 10,
      sprintEachDayWithStatus: [],
      absences: [],
      teamMembers: [],
      absenceDays: new Map(),
      disablePrevButton: false,
    };
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      loading: true,
    });

    await this.loadUsers();
    await this.loadAbsences();
    await this.loadTotalWorkdaysForCurrentSprint();
    await this.loadAbsenceDaysCount();

    this.setState({
      loading: false,
    });
  }

  async componentDidUpdate(prevProps: SprintPlanningProps, prevState: SprintPlanningState): Promise<void> {
    if (prevState.sprintIndex !== this.state.sprintIndex) {
      this.setState({
        loading: true,
      });

      await this.loadUsers();
      await this.loadAbsences();
      await this.loadTotalWorkdaysForCurrentSprint();
      await this.loadAbsenceDaysCount();

      this.setState({
        loading: false,
      });
    }
  }

  render(): JSX.Element {
    const {
      loading,
      error,
      absences,
      sprintTotalWorkdays,
      sprintPeriod,
      sprintEachDayWithStatus,
      teamMembers,
      absenceDays,
    } = this.state;
    if (error) {
      return <Error message={error} />;
    }
    if (loading) {
      return <CircularProgress className="sprint-planning-loader" />;
    }
    return (
      <div className="sprint-planning-container">
        {this.renderHeader()}
        <TeamCapacityTable
          teamMembers={teamMembers}
          absenceDays={absenceDays}
          sprintTotalWorkdays={sprintTotalWorkdays}
          absences={absences}
          setError={this.setError}
        />
        <AbsenceOverview
          teamMembers={teamMembers}
          absenceDays={absenceDays}
          absences={absences}
          sprintPeriod={sprintPeriod}
          sprintEachDayWithStatus={sprintEachDayWithStatus}
        />
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
          <Tooltip arrow title={this.state.disablePrevButton ? noDataError : ""} placement="bottom">
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
          <Typography variant="h5">
            Sprint ({sprintStartDDMMYYYY} - {sprintEndDDMMYYYY})
          </Typography>
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

  async loadUsers(): Promise<void> {
    try {
      const teamMembers = await this.userService.getFilteredUsers(
        this.props.userState.userDetails.team.id,
        anyPosition,
        anyRole,
      );

      this.setState({
        teamMembers,
      });
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }
  }

  async loadAbsences(): Promise<void> {
    try {
      const period = this.sprintPlanningService.getSprintPeriod(this.state.sprintIndex);

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

  async loadAbsenceDaysCount(): Promise<void> {
    try {
      const absenceDays = this.sprintPlanningService.getUsersAbsenceDaysCount(
        this.state.teamMembers,
        this.state.absences,
      );

      this.setState({
        absenceDays,
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
        sprintEachDayWithStatus: totalDays,
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

  setError = (error: string): void => {
    this.setState({
      error,
    });
  };

  setLoading = (loading: boolean): void => {
    this.setState({
      loading,
    });
  };
}

const mapStateToProps = ({ userInfoReducer }: ApplicationState) => {
  return {
    userState: userInfoReducer,
  };
};

export default connect(mapStateToProps)(SprintPlanning);
