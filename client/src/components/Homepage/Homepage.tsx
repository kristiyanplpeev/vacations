import React, { Component } from "react";

import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
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

import { PTOStatus } from "common/constants";
import { DateUtil } from "common/DateUtil";
import { IUserPTOWithCalcDays } from "common/types";
import Error from "components/common/Error/Error";
import { IPTOService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface HomepageProps extends RouteComponentProps<null, StaticContext, { showSnackbar: boolean }> {}

interface HomepageState {
  loading: boolean;
  error: string;
  successMessage: boolean;
  userPastPTOs: Array<IUserPTOWithCalcDays>;
  userFuturePTOs: Array<IUserPTOWithCalcDays>;
  anchorEl: HTMLButtonElement | null;
}

class Homepage extends Component<HomepageProps, HomepageState> {
  @resolve(TYPES.PTO) private PTOService!: IPTOService;

  constructor(props: HomepageProps) {
    super(props);
    this.state = {
      loading: false,
      error: "",
      successMessage: false,
      userPastPTOs: [],
      userFuturePTOs: [],
      anchorEl: null,
    };
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async componentDidMount(): Promise<void> {
    this.openSnackbar(true);
    this.setState({
      loading: true,
    });
    try {
      const userPTOs = await this.getUserPTOs();

      this.setState({
        userFuturePTOs: userPTOs.userFuturePTOs,
        userPastPTOs: userPTOs.userPastPTOs,
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
      return <Error />;
    }
    if (this.state.loading) {
      return <CircularProgress />;
    }
    return (
      <div className="homepage-root">
        <h1 className="homepage-header">Paid Time Off</h1>
        {this.state.userFuturePTOs.length === 0 && this.state.userPastPTOs.length === 0
          ? this.renderNoPTOsView()
          : this.renderPTOsTable()}
        {this.renderPopover()}
        {this.renderSnackbar()}
      </div>
    );
  }

  renderAddPTOButton(): JSX.Element {
    return (
      <Button
        className="homepage-add-pto-button"
        onClick={() => this.props.history.push("/new")}
        variant="outlined"
        color="primary"
      >
        Add PTO
      </Button>
    );
  }

  renderPTOsTable(): JSX.Element {
    return (
      <div>
        {this.renderAddPTOButton()}
        {this.renderHeaderAndFooter(true)}
        {this.renderPTOsSeparator()}
        {this.renderHeaderAndFooter(false)}
        {this.renderAddPTOButton()}
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
              <TableBody>{this.state.userFuturePTOs.map(this.mappingFunc)}</TableBody>
            </>
          ) : (
            <>
              <TableBody>{this.state.userPastPTOs.map(this.mappingFunc)}</TableBody>
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
        <TableCell width="10%">
          <b>Status</b>
        </TableCell>
        <TableCell width="10%" align="left">
          <b>From</b>
        </TableCell>
        <TableCell width="10%" align="left">
          <b>To</b>
        </TableCell>
        <TableCell width="8%" align="left">
          <b>PTO days</b>
        </TableCell>
        <TableCell width="8%" align="left">
          <b>Total days</b>
        </TableCell>
        <TableCell width="5%" align="left"></TableCell>
        <TableCell width="5%" align="left"></TableCell>
        <TableCell width="30%" align="left">
          <b>Comment</b>
        </TableCell>
      </TableRow>
    );
  }

  renderPTOsSeparator(): JSX.Element | null {
    if (this.state.userFuturePTOs.length === 0 || this.state.userPastPTOs.length === 0) return null;
    return (
      <div className="or-spacer">
        <div className="mask"></div>
        <span>
          <i>now</i>
        </span>
      </div>
    );
  }

  renderNoPTOsView(): JSX.Element {
    return (
      <div>
        <div className="homepage-message-wrapper">
          <Typography className="homepage-message-text" variant="h5" gutterBottom>
            Looks like you need a break
          </Typography>
          <SentimentSatisfiedSharpIcon fontSize="large" />
        </div>
        <Button onClick={() => this.props.history.push("/new")} variant="outlined" color="primary">
          REQUEST VACATION
        </Button>
      </div>
    );
  }

  renderPopover(): JSX.Element {
    return (
      <Popover
        className="homepage-popover"
        id="mouse-over-popover"
        open={Boolean(this.state.anchorEl)}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={() => this.handlePopoverClose()}
        disableRestoreFocus
      >
        <Typography className="dates-calculator-popover-text">Approved or rejected PTOs can&#39;t be edited</Typography>
      </Popover>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  private mappingFunc = (el: IUserPTOWithCalcDays): JSX.Element => (
    <TableRow hover key={el.id}>
      <TableCell width="10%">{el.status}</TableCell>
      <TableCell width="10%" align="left">
        {el.from_date}
      </TableCell>
      <TableCell width="10%" align="left">
        {el.to_date}
      </TableCell>
      <TableCell width="8%" align="left">
        {el.PTODays}
      </TableCell>
      <TableCell width="8%" align="left">
        {el.totalDays}
      </TableCell>
      <TableCell width="5%" align="left">
        <Button color="primary" onClick={() => this.props.history.push(`/pto/${el.id}`)}>
          view
        </Button>
      </TableCell>
      <TableCell width="5%" align="left">
        <Button
          onMouseEnter={(event: React.MouseEvent<HTMLButtonElement>) => this.handleEditHover(event, el.status)}
          onMouseLeave={() => this.handlePopoverClose()}
          className="homepage-button-wrapper"
          disableRipple
        >
          <Button
            color="primary"
            onClick={() => this.handleEditClick(el.id)}
            disabled={el.status !== PTOStatus.requested}
          >
            edit
          </Button>
        </Button>
      </TableCell>
      <TableCell width="30%" align="left">
        {el.comment}
      </TableCell>
    </TableRow>
  );

  renderSnackbar(): JSX.Element {
    return (
      <Snackbar open={this.state.successMessage} onClose={() => this.openSnackbar(false)} autoHideDuration={2000}>
        <Alert severity="success">Your PTO has been successfully submitted!</Alert>
      </Snackbar>
    );
  }

  handleEditHover(event: React.MouseEvent<HTMLButtonElement>, currentPTOStatus: string): void {
    if (currentPTOStatus !== PTOStatus.requested) {
      this.setState({
        anchorEl: event.currentTarget,
      });
    }
  }

  handleEditClick(currentPTOId: string): void {
    this.props.history.push(`/edit/${currentPTOId}`);
  }

  handlePopoverClose(): void {
    this.setState({
      anchorEl: null,
    });
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

  private async getUserPTOs() {
    const userPTOs = await this.PTOService.getUserPTOs();
    const userFuturePTOs = userPTOs
      .filter((el) => el.from_date > DateUtil.todayStringified())
      .sort(DateUtil.dateSorting);
    const userPastPTOs = userPTOs
      .filter((el) => el.from_date <= DateUtil.todayStringified())
      .sort(DateUtil.dateSorting);

    return {
      userFuturePTOs,
      userPastPTOs,
    };
  }
}

export default Homepage;
