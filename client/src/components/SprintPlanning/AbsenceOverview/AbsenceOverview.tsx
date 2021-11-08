import React, { Component } from "react";

import { DateRangePickerDayProps } from "@mui/lab/DateRangePickerDay";
import StaticDateRangePicker from "@mui/lab/StaticDateRangePicker";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import "components/Homepage/Homepage.css";
import Typography from "@mui/material/Typography";
import { isWithinInterval, eachMonthOfInterval, subDays } from "date-fns";
import { resolve } from "inversify-react";

import { IUserAbsenceWithWorkingDaysAndEmployee, IUserWithTeamAndPosition, SprintPeriod } from "common/interfaces";
import { HolidayDays } from "common/interfaces";
import { DateRangePickerDay } from "components/Absences/Absences";
import { IAbsenceService, IHolidayService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface AbsenceOverviewProps {
  sprintPeriod: SprintPeriod;
  sprintEachDayWithStatus: HolidayDays;
  absences: Array<IUserAbsenceWithWorkingDaysAndEmployee>;
  teamMembers: Array<IUserWithTeamAndPosition>;
  absenceDays: Map<string, number>;
}

interface AbsenceOverviewState {}

class AbsenceOverview extends Component<AbsenceOverviewProps, AbsenceOverviewState> {
  @resolve(TYPES.Absence) private absenceService!: IAbsenceService;
  @resolve(TYPES.Holidays) private holidaysService!: IHolidayService;

  render(): JSX.Element {
    return (
      <>
        <Typography style={{ marginTop: "80px", marginBottom: "50px" }} variant="h3">
          Absence Overview
        </Typography>
        {this.renderUserAbsences()}
        {this.renderCalendar()}
      </>
    );
  }

  renderUserAbsences(): JSX.Element {
    const { absenceDays, teamMembers } = this.props;
    return (
      // alternatively this can be Stack component
      <Stack>
        {teamMembers.map((member) => {
          const absence = absenceDays.get(member.id);

          if (!absence) {
            return <></>;
          }
          return (
            <Chip
              key={member.id}
              className="absence-card-chip"
              avatar={<Avatar className="absence-card-chip-avatar" alt={member.firstName[0]} src={member.picture} />}
              label={`${member.email} ---> ${absence} days`}
              variant="outlined"
            />
          );
        })}
      </Stack>
    );
  }

  renderCalendar(): JSX.Element {
    const { startingDate, endingDate } = this.props.sprintPeriod;
    const monthsToRender = eachMonthOfInterval({ start: startingDate, end: endingDate }).length;
    return (
      <Grid container justifyContent="center">
        <StaticDateRangePicker
          displayStaticWrapperAs="desktop"
          calendars={monthsToRender as 1 | 2}
          disablePast
          disableFuture
          disableHighlightToday
          shouldDisableDate={() => true}
          label="date range"
          value={[startingDate, null]}
          onChange={() => null}
          renderDay={(date: Date, dateRangePickerDayProps: DateRangePickerDayProps<Date>) => {
            return this.renderAbsenceDay(date, dateRangePickerDayProps);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
      </Grid>
    );
  }

  renderAbsenceDay(date: Date, dateRangePickerDayProps: DateRangePickerDayProps<Date>): JSX.Element {
    const { startingDate, endingDate } = this.props.sprintPeriod;
    const start = subDays(startingDate, 1);
    const dayIsBetween = isWithinInterval(date, { start, end: endingDate });
    const dayIsHoliday = this.holidaysService.checkIfDayIsHoliday(date, this.props.sprintEachDayWithStatus);
    const className = dayIsBetween && !dayIsHoliday ? "absence" : "non-absence";
    dateRangePickerDayProps.inlist = dayIsHoliday;
    dateRangePickerDayProps.isHighlighting = dayIsBetween;

    if (!dayIsHoliday && !dateRangePickerDayProps.outsideCurrentMonth) {
      const names = this.absenceService.getAbsentEmployeesNames(date, this.props.absences);

      return (
        <Tooltip title={names.toString()} arrow>
          <Badge overlap="circular" color="secondary" badgeContent={names.length}>
            <DateRangePickerDay className={className} {...dateRangePickerDayProps} />
          </Badge>
        </Tooltip>
      );
    }

    return <DateRangePickerDay className={className} {...dateRangePickerDayProps} />;
  }
}

export default AbsenceOverview;
