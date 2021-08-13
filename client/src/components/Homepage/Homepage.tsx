import React, { Component } from "react";

import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import SentimentSatisfiedSharpIcon from "@material-ui/icons/SentimentSatisfiedSharp";
import "./Homepage.css";
import { resolve } from "inversify-react";
import { RouteComponentProps } from "react-router";

import { IUserHoliday } from "common/types";
import Error from "components/common/Error/Error";
import { IPTOService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface HomepageProps extends RouteComponentProps {}

interface HomepageState {
  loading: boolean;
  error: string;
  userPastPTOs: Array<IUserHoliday>;
  userFuturePTOs: Array<IUserHoliday>;
}

class Homepage extends Component<HomepageProps, HomepageState> {
  @resolve(TYPES.PTO) private PTOService!: IPTOService;

  constructor(props: HomepageProps) {
    super(props);
    this.state = {
      loading: false,
      error: "",
      userPastPTOs: [],
      userFuturePTOs: [],
    };
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async componentDidMount(): Promise<void> {
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
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>{this.renderTableHeaderAndFooter()}</TableHead>
            <TableBody>{this.state.userFuturePTOs.map(this.mappingFunc)}</TableBody>
          </Table>
        </TableContainer>
        {this.renderPTOsSeparator()}
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody>{this.state.userPastPTOs.map(this.mappingFunc)}</TableBody>
            <TableFooter className="homepage-table-footer">{this.renderTableHeaderAndFooter()}</TableFooter>
          </Table>
        </TableContainer>
        {this.renderAddPTOButton()}
      </div>
    );
  }

  renderTableHeaderAndFooter(): JSX.Element {
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
        <TableCell width="10%" align="left">
          <b>PTO days</b>
        </TableCell>
        <TableCell width="10%" align="left">
          <b>Total days</b>
        </TableCell>
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
        <Button
          className="homepage-button-text"
          onClick={() => this.props.history.push("/new")}
          variant="outlined"
          color="primary"
        >
          REQUEST VACATION
        </Button>
      </div>
    );
  }

  private async getUserPTOs() {
    const userPTOs = await this.PTOService.userPTOs();
    const sortingFunc = (a: IUserHoliday, b: IUserHoliday) => {
      const aa = a.from_date.split("-").join();
      const bb = b.from_date.split("-").join();
      return aa > bb ? -1 : aa < bb ? 1 : 0;
    };
    const userFuturePTOs = userPTOs
      .filter((el) => el.from_date > new Date().toISOString().slice(0, 10))
      .sort(sortingFunc);
    const userPastPTOs = userPTOs
      .filter((el) => el.from_date <= new Date().toISOString().slice(0, 10))
      .sort(sortingFunc);

    return {
      userFuturePTOs,
      userPastPTOs,
    };
  }

  private mappingFunc = (el: IUserHoliday): JSX.Element => (
    <TableRow hover key={el.id}>
      <TableCell width="10%">{el.status}</TableCell>
      <TableCell width="10%" align="left">
        {el.from_date}
      </TableCell>
      <TableCell width="10%" align="left">
        {el.to_date}
      </TableCell>
      <TableCell width="10%" align="left">
        {el.PTODays}
      </TableCell>
      <TableCell width="10%" align="left">
        {el.totalDays}
      </TableCell>
      <TableCell
        className="homepage-view-pto-button"
        width="5%"
        align="left"
        onClick={() => this.props.history.push(`/pto/${el.id}`)}
      >
        view
      </TableCell>
      <TableCell width="30%" align="left">
        {el.comment}
      </TableCell>
    </TableRow>
  );
}

export default Homepage;
