import React, { Component } from "react";

import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import "./Homepage.css";
import { resolve } from "inversify-react";
import { RouteComponentProps } from "react-router";

import AppError from "common/AppError/AppError";
import { UserHolidayType } from "common/types";
import { HolidaysServiceInterface } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface HomepageProps extends RouteComponentProps {}

interface HomepageState {
  loading: boolean;
  error: boolean;
  userPastPTOs: UserHolidayType[];
  userFuturePTOs: UserHolidayType[];
}

class Homepage extends Component<HomepageProps, HomepageState> {
  @resolve(TYPES.Holidays) private holidaysService!: HolidaysServiceInterface;

  renderAddPTOButton(): JSX.Element {
    return (
      <Button
        className="homapage-addpto-button"
        onClick={() => this.props.history.push("/new")}
        variant="outlined"
        color="primary"
      >
        Add PTO
      </Button>
    );
  }

  constructor(props: HomepageProps) {
    super(props);
    this.state = {
      loading: false,
      error: false,
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
      const userPTOs = await this.holidaysService.userPTOsRequest();
      const sortingFunc = (a: UserHolidayType, b: UserHolidayType) => {
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

      this.setState({
        userFuturePTOs,
        userPastPTOs,
      });
    } catch (error) {
      this.setState({
        error: true,
      });
    }
    this.setState({
      loading: false,
    });
  }

  render(): JSX.Element {
    if (this.state.error) {
      return <AppError message={this.state.error} />;
    }
    if (this.state.loading) {
      return <CircularProgress />;
    }
    return (
      <div className="homepage-root">
        <h1 className="homapage-header">Paid Time Off</h1>
        {this.renderAddPTOButton()}
        <TableContainer component={Paper}>
          <Table className={"asd"} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>status</TableCell>
                <TableCell align="left">from</TableCell>
                <TableCell align="left">to</TableCell>
                <TableCell align="left">PTO days</TableCell>
                <TableCell align="left">Total days</TableCell>
                <TableCell align="left"> </TableCell>
                <TableCell align="left">comment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.userFuturePTOs.map(this.mappingFunc)}
              <TableRow key="key">
                <Typography variant="h5" gutterBottom>
                  -----today-----
                </Typography>
              </TableRow>
              {this.state.userPastPTOs.map(this.mappingFunc)}
            </TableBody>
          </Table>
        </TableContainer>
        {this.renderAddPTOButton()}
      </div>
    );
  }

  private mappingFunc = (el: UserHolidayType): JSX.Element => (
    <TableRow key={el.id}>
      <TableCell>{el.status}</TableCell>
      <TableCell align="left">{el.from_date}</TableCell>
      <TableCell align="left">{el.to_date}</TableCell>
      <TableCell align="left">{el.PTODays}</TableCell>
      <TableCell align="left">{el.totalDays}</TableCell>
      <TableCell align="left">view</TableCell>
      <TableCell align="left">{el.comment}</TableCell>
    </TableRow>
  );
}

export default Homepage;
