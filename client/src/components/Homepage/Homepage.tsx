import React, { Component } from "react";

import { Button, Divider } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import SentimentSatisfiedSharpIcon from "@material-ui/icons/SentimentSatisfiedSharp";
import { Alert } from "@material-ui/lab";
import MuiDateRangePickerDay, { DateRangePickerDayProps } from "@mui/lab/DateRangePickerDay";
import StaticDateRangePicker from "@mui/lab/StaticDateRangePicker";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import "./Homepage.css";
import { isWithinInterval, isWeekend, subDays, min } from "date-fns";
import { resolve } from "inversify-react";
import { RouteComponentProps, StaticContext } from "react-router";

import { AbsencesEnum, leaveTypesWithURLs, ViewsEnum } from "common/constants";
import { DateUtil } from "common/DateUtil";
import { IUserAbsenceWithEachDayStatus, IUserAbsenceWithWorkingDays } from "common/interfaces";
import { HolidayDays } from "common/interfaces";
import Error from "components/common/Error/Error";
import { IAbsenceService, IHolidayService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

const DateRangePickerDay = styled(MuiDateRangePickerDay, {
  shouldForwardProp: (prop) => prop !== "isHighlighting" && prop !== "inlist",
})(({ theme, isHighlighting, inlist, outsideCurrentMonth }) => {
  return {
    ...(isHighlighting &&
      !inlist &&
      !outsideCurrentMonth && {
        borderRadius: "50%",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        "&:hover, &:focus": {
          backgroundColor: theme.palette.primary.dark,
        },
      }),
    ...(inlist &&
      !outsideCurrentMonth && {
        backgroundColor: "lightblue",
        borderRadius: "50%",
      }),
  };
}) as React.ComponentType<DateRangePickerDayProps<Date>>;

interface IUserAbcenseWithDate {
  id: string;
  type: string;
  startingDate: Date;
  endingDate: Date;
  comment: string;
  workingDays: number;
  totalDays: number;
}

interface HomepageProps extends RouteComponentProps<null, StaticContext, { showSnackbar: boolean }> {}

interface HomepageState {
  loading: boolean;
  error: string;
  successMessage: boolean;
  openSelectorDialog: boolean;
  userPastAbsences: Array<IUserAbcenseWithDate>;
  userFutureAbsences: Array<IUserAbcenseWithDate>;
  view: ViewsEnum;
  holidays: HolidayDays;
}

class Homepage extends Component<HomepageProps, HomepageState> {
  @resolve(TYPES.Absence) private absenceService!: IAbsenceService;
  @resolve(TYPES.Holidays) private holidaysService!: IHolidayService;

  constructor(props: HomepageProps) {
    super(props);
    this.state = {
      loading: false,
      error: "",
      successMessage: false,
      openSelectorDialog: false,
      userPastAbsences: [],
      userFutureAbsences: [],
      view: ViewsEnum.table,
      holidays: [],
    };
  }

  async componentDidMount(): Promise<void> {
    this.openSnackbar(true);
    this.setState({
      loading: true,
    });

    await this.loadAbsences();
    await this.loadHolidaysForThreeMonths();

    this.setState({
      loading: false,
    });
  }

  async loadHolidaysForThreeMonths(): Promise<void> {
    try {
      const date = new Date();
      const startingDate = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString("en-CA");
      const endingDate = new Date(date.getFullYear(), date.getMonth() + 3, 1).toLocaleDateString("en-CA");
      const holidays = await this.holidaysService.getDatesStatus({ startingDate, endingDate });
      this.setState({
        holidays,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  }

  async loadAbsences(): Promise<void> {
    try {
      const userAbsences = await this.getUserAbsences();

      this.setState({
        userFutureAbsences: userAbsences.userFutureAbsences,
        userPastAbsences: userAbsences.userPastAbsences,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  }

  render(): JSX.Element {
    if (this.state.error) {
      return <Error message={this.state.error} />;
    }
    return (
      <div className="homepage-root">
        <h1 className="homepage-header">My Absences</h1>
        {this.state.userFutureAbsences.length === 0 && this.state.userPastAbsences.length === 0
          ? this.renderNoUserAbsencesView()
          : this.renderUserAbsencesTable()}
        {this.renderSnackbar()}
        {this.renderSelectDialog()}
      </div>
    );
  }

  renderAddAbsenceButton(): JSX.Element {
    return (
      <Button
        className="homepage-add-absence-button"
        onClick={() => this.handleToggleSelectDialog(true)}
        variant="outlined"
        color="primary"
      >
        Add absence
      </Button>
    );
  }

  renderUserAbsencesTable(): JSX.Element {
    return (
      <div>
        <Grid container alignItems="center">
          {this.renderAddAbsenceButton()}
          {this.renderTabs()}
        </Grid>
        {this.renderHeaderAndFooter(true)}
        {this.renderSeparator()}
        {this.renderHeaderAndFooter(false)}
        {this.renderAddAbsenceButton()}
      </div>
    );
  }

  renderTabs(): JSX.Element {
    const { view } = this.state;

    return (
      <Grid item style={{ marginLeft: "30px" }}>
        <Tabs indicatorColor="secondary" value={view} onChange={this.handleTabChange}>
          <Tab value={ViewsEnum.table} label={"Table View"} />
          <Tab value={ViewsEnum.calendar} label={"Calendar View"} />
        </Tabs>
      </Grid>
    );
  }

  renderHeaderAndFooter(header: boolean): JSX.Element {
    const { view } = this.state;
    if (view === ViewsEnum.table) {
      return this.renderTables(header);
    } else if (header && view === ViewsEnum.calendar) {
      return this.renderCalendar();
    }
    return <></>;
  }

  renderTables(header: boolean): JSX.Element {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          {header ? (
            <>
              <TableHead>{this.renderTableHeaderAndFooterCells()}</TableHead>
              <TableBody>{this.state.userFutureAbsences.map(this.mappingFunc)}</TableBody>
            </>
          ) : (
            <>
              <TableBody>{this.state.userPastAbsences.map(this.mappingFunc)}</TableBody>
              <TableFooter className="homepage-table-footer">{this.renderTableHeaderAndFooterCells()}</TableFooter>
            </>
          )}
        </Table>
      </TableContainer>
    );
  }

  getPeriods(): Array<{ start: Date; end: Date }> {
    const mappingFunc = (absence: IUserAbcenseWithDate) => {
      // In order to correctly display the period, you need to pass
      // the day before the startingDate to the DateRangePicker component from Material UI
      const start = subDays(absence.startingDate, 1);

      return {
        start,
        end: absence.endingDate,
      };
    };

    const futurePeriods = this.state.userFutureAbsences.map(mappingFunc);
    const pastPeriods = this.state.userPastAbsences.map(mappingFunc);

    return futurePeriods.concat(pastPeriods);
  }

  renderCalendar(): JSX.Element {
    const periods = this.getPeriods();

    return (
      <StaticDateRangePicker
        displayStaticWrapperAs="desktop"
        calendars={3}
        disablePast
        disableFuture
        disableHighlightToday
        shouldDisableDate={() => true}
        label="date range"
        value={[null, null]}
        onChange={() => null}
        renderDay={(date: Date, dateRangePickerDayProps: DateRangePickerDayProps<Date>) => {
          return this.renderAbsenceDay(date, dateRangePickerDayProps, periods);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    );
  }

  renderAbsenceDay(
    date: Date,
    dateRangePickerDayProps: DateRangePickerDayProps<Date>,
    periods: Array<{ start: Date; end: Date }>,
    absences?: Array<IUserAbsenceWithEachDayStatus>,
  ): JSX.Element {
    const dayIsBetween = periods.some((p) => isWithinInterval(date, { start: p.start, end: p.end }));
    const dayIsHoliday = this.checkIfDayIsHoliday(date);
    const className = dayIsBetween && !dayIsHoliday ? "absence" : "non-absence";
    dateRangePickerDayProps.inlist = dayIsHoliday;
    dateRangePickerDayProps.isHighlighting = dayIsBetween;

    if (absences && dayIsBetween && !dayIsHoliday && !dateRangePickerDayProps.outsideCurrentMonth) {
      const names = this.getEmployeesNames(date, absences);

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

  renderTableHeaderAndFooterCells(): JSX.Element {
    return (
      <TableRow>
        <TableCell width="10%" align="left">
          <b>Type</b>
        </TableCell>
        <TableCell width="10%" align="left">
          <b>From</b>
        </TableCell>
        <TableCell width="10%" align="left">
          <b>To</b>
        </TableCell>
        <TableCell width="8%" align="left">
          <b>Working days</b>
        </TableCell>
        <TableCell width="8%" align="left">
          <b>Total days</b>
        </TableCell>
        <TableCell width="10%" align="left"></TableCell>
        <TableCell width="10%" align="left"></TableCell>
        <TableCell width="30%" align="left">
          <b>Comment</b>
        </TableCell>
      </TableRow>
    );
  }

  renderSelectDialog(): JSX.Element {
    return (
      <Dialog onClose={() => this.handleToggleSelectDialog(false)} open={this.state.openSelectorDialog}>
        <DialogTitle>Specify the type of leave you want to request?</DialogTitle>
        <Divider className="homepage-main-divider" />
        <List>
          {Object.values(AbsencesEnum).map((el) => {
            const absenceUrl = Object.values(leaveTypesWithURLs).find((absence) => absence.leave === el);
            if (!absenceUrl) {
              this.setState({
                error: `Type ${el} is not supported`,
              });
              return;
            }
            return (
              <>
                <ListItem button key={el} onClick={() => this.props.history.push(`/new/${absenceUrl.url}`)}>
                  <ListItemText primary={el} />
                </ListItem>
                <Divider />
              </>
            );
          })}
        </List>
      </Dialog>
    );
  }

  renderSeparator(): JSX.Element {
    const { userFutureAbsences, userPastAbsences, view } = this.state;

    if (!userFutureAbsences.length || !userPastAbsences.length || view === ViewsEnum.calendar) return <></>;
    return (
      <div className="or-spacer">
        <div className="mask"></div>
        <span>
          <i>now</i>
        </span>
      </div>
    );
  }

  renderNoUserAbsencesView(): JSX.Element {
    if (this.state.loading) {
      return <CircularProgress />;
    }
    return (
      <div>
        <div className="homepage-message-wrapper">
          <Typography className="homepage-message-text" variant="h5" gutterBottom>
            Looks like you need a break
          </Typography>
          <SentimentSatisfiedSharpIcon fontSize="large" />
        </div>
        <Button onClick={() => this.handleToggleSelectDialog(true)} variant="outlined" color="primary">
          REQUEST ABSENCE
        </Button>
      </div>
    );
  }

  renderSnackbar(): JSX.Element {
    return (
      <Snackbar open={this.state.successMessage} onClose={() => this.openSnackbar(false)} autoHideDuration={2000}>
        <Alert severity="success">Your absence has been successfully submitted!</Alert>
      </Snackbar>
    );
  }

  private mappingFunc = (el: IUserAbcenseWithDate): JSX.Element => (
    <TableRow hover key={el.id}>
      <TableCell width="10%" align="left">
        {el.type}
      </TableCell>
      <TableCell width="10%" align="left">
        {el.startingDate.toLocaleDateString("en-CA")}
      </TableCell>
      <TableCell width="10%" align="left">
        {el.endingDate.toLocaleDateString("en-CA")}
      </TableCell>
      <TableCell width="8%" align="left">
        {el.workingDays}
      </TableCell>
      <TableCell width="8%" align="left">
        {el.totalDays}
      </TableCell>
      <TableCell width="5%" align="left">
        <Button color="primary" onClick={() => this.props.history.push(`/absence/${el.id}`)}>
          view
        </Button>
      </TableCell>
      <TableCell width="5%" align="left">
        <Button color="primary" onClick={() => this.handleEditClick(el.id, el.type)}>
          edit
        </Button>
      </TableCell>
      <TableCell width="30%" align="left">
        {el.comment ? el.comment : <div className="homepage-absence-comment">not available</div>}
      </TableCell>
    </TableRow>
  );

  handleTabChange = (event: React.SyntheticEvent, newView: ViewsEnum): void => {
    this.setState({
      view: newView,
    });
  };

  handleToggleSelectDialog(state: boolean): void {
    this.setState({
      openSelectorDialog: state,
    });
  }

  handleEditClick(currentAbsenceId: string, type: string): void {
    const absenceUrl = Object.values(leaveTypesWithURLs).find((absence) => absence.leave === type);
    if (!absenceUrl) {
      this.setState({
        error: "Selected type is not supported",
      });
      return;
    }
    this.props.history.push(`/edit/${absenceUrl.url}/${currentAbsenceId}`);
  }

  private openSnackbar(isOpen: boolean): void {
    if (this.props.location.state?.showSnackbar && isOpen) {
      this.setState({
        successMessage: true,
      });
      this.props.history.replace("/home");
    } else if (!isOpen) {
      this.setState({
        successMessage: false,
      });
    }
  }

  private async getUserAbsences() {
    const userAbsences = await this.absenceService.getUserAbsences();
    const userFutureAbsences = userAbsences
      .filter((el) => el.startingDate > DateUtil.todayStringified())
      .sort(DateUtil.dateSorting)
      .map(this.mapUserAbsences);
    const userPastAbsences = userAbsences
      .filter((el) => el.startingDate <= DateUtil.todayStringified())
      .sort(DateUtil.dateSorting)
      .map(this.mapUserAbsences);

    return {
      userFutureAbsences,
      userPastAbsences,
    };
  }

  private mapUserAbsences(absence: IUserAbsenceWithWorkingDays): IUserAbcenseWithDate {
    return { ...absence, startingDate: new Date(absence.startingDate), endingDate: new Date(absence.endingDate) };
  }

  private getEmployeesNames(date: Date, absences: Array<IUserAbsenceWithEachDayStatus>): Array<string> {
    return absences
      .filter((absence) => {
        const start = subDays(new Date(absence.startingDate), 1);
        const end = new Date(absence.endingDate);

        return isWithinInterval(date, { start, end });
      })
      .map((a) => a.employee.firstName);
  }

  private checkIfDayIsHoliday(date: Date): boolean {
    const holiday = this.state.holidays.find((holiday) => holiday.date === date.toLocaleDateString("en-CA"));
    if (holiday) {
      return holiday.status !== "workday";
    }

    return false;
  }
}

export default Homepage;
