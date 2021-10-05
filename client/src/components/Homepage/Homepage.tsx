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
import "./Homepage.css";
import { resolve } from "inversify-react";
import { RouteComponentProps, StaticContext } from "react-router";

import { AbsencesEnum } from "common/constants";
import { DateUtil } from "common/DateUtil";
import { IUserAbsenceWithWorkingDays } from "common/interfaces";
import { StringUtil } from "common/StringUtil";
import Error from "components/common/Error/Error";
import { IAbsenceService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface HomepageProps extends RouteComponentProps<null, StaticContext, { showSnackbar: boolean }> {}

interface HomepageState {
  loading: boolean;
  error: string;
  successMessage: boolean;
  openSelectorDialog: boolean;
  userPastAbsences: Array<IUserAbsenceWithWorkingDays>;
  userFutureAbsences: Array<IUserAbsenceWithWorkingDays>;
}

class Homepage extends Component<HomepageProps, HomepageState> {
  @resolve(TYPES.Absence) private AbsenceService!: IAbsenceService;

  constructor(props: HomepageProps) {
    super(props);
    this.state = {
      loading: false,
      error: "",
      successMessage: false,
      openSelectorDialog: false,
      userPastAbsences: [],
      userFutureAbsences: [],
    };
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async componentDidMount(): Promise<void> {
    this.openSnackbar(true);
    this.setState({
      loading: true,
    });
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
    this.setState({
      loading: false,
    });
  }

  // eslint-disable-next-line max-lines-per-function
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
        {this.renderAddAbsenceButton()}
        {this.renderHeaderAndFooter(true)}
        {this.renderSeparator()}
        {this.renderHeaderAndFooter(false)}
        {this.renderAddAbsenceButton()}
      </div>
    );
  }

  renderHeaderAndFooter(header: boolean): JSX.Element {
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
          {Object.values(AbsencesEnum).map((el) => (
            <>
              <ListItem button key={el} onClick={() => this.props.history.push(`/new/${StringUtil.zipString(el)}`)}>
                <ListItemText primary={el} />
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </Dialog>
    );
  }

  renderSeparator(): JSX.Element {
    if (this.state.userFutureAbsences.length === 0 || this.state.userPastAbsences.length === 0) return <></>;
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

  private mappingFunc = (el: IUserAbsenceWithWorkingDays): JSX.Element => (
    <TableRow hover key={el.id}>
      <TableCell width="10%" align="left">
        {el.type}
      </TableCell>
      <TableCell width="10%" align="left">
        {el.from_date}
      </TableCell>
      <TableCell width="10%" align="left">
        {el.to_date}
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

  handleToggleSelectDialog(state: boolean): void {
    this.setState({
      openSelectorDialog: state,
    });
  }

  handleEditClick(currentAbsenceId: string, type: string): void {
    const absenceType = StringUtil.zipString(type);
    this.props.history.push(`/edit/${absenceType}/${currentAbsenceId}`);
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
    const userAbsences = await this.AbsenceService.getUserAbsences();
    const userFutureAbsences = userAbsences
      .filter((el) => el.from_date > DateUtil.todayStringified())
      .sort(DateUtil.dateSorting);
    const userPastAbsences = userAbsences
      .filter((el) => el.from_date <= DateUtil.todayStringified())
      .sort(DateUtil.dateSorting);

    return {
      userFutureAbsences,
      userPastAbsences,
    };
  }
}

export default Homepage;
