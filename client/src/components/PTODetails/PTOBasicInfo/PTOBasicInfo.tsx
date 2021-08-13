import React, { Component } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import DescriptionIcon from "@material-ui/icons/Description";
import EditIcon from "@material-ui/icons/Edit";
import "./PTOBasicInfo.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RouteComponentProps, withRouter } from "react-router";

import { UserHolidayBasicInfoType, UserInfoType } from "common/types";
import MyDocument from "components/PTODetails/PDFDocu/AtscaleLeaveRequest";

interface PTOBasicInfoProps extends RouteComponentProps {
  PTOInfo: UserHolidayBasicInfoType;
  employee: UserInfoType;
  approvers: Array<UserInfoType>;
  workingDays: number;
}

class PTOBasicInfo extends Component<PTOBasicInfoProps> {
  constructor(props: PTOBasicInfoProps) {
    super(props);
  }

  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <Typography className="ptobasicinfo-header" variant="h5" component="h2">
            Details
          </Typography>
          {this.renderUser([this.props.employee], "Employee")}
          {this.renderInfoCard()}
          {this.renderUser(this.props.approvers, "Approvers")}
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Button
                className="ptobasicinfo-buttons"
                variant="outlined"
                color="primary"
                onClick={() => this.props.history.push("/home")}
              >
                <ArrowBackIosIcon /> Go Back
              </Button>
            </Grid>
            <Grid item xs={4}>
              <PDFDownloadLink
                document={
                  <MyDocument
                    employee={this.props.employee}
                    PTOInfo={this.props.PTOInfo}
                    workingDays={this.props.workingDays}
                  />
                }
                fileName={`${this.props.employee.firstName} ${this.props.employee.lastName} Vacation.pdf`}
              >
                <Button
                  data-unit-test="addPTO-button"
                  className="ptobasicinfo-buttons"
                  variant="outlined"
                  color="primary"
                  onClick={() => {}}
                >
                  <DescriptionIcon /> Generate pdf
                </Button>
              </PDFDownloadLink>
            </Grid>
            <Grid item xs={4}>
              <Button
                data-unit-test="addPTO-button"
                className="ptobasicinfo-buttons"
                variant="outlined"
                color="primary"
                onClick={() => {}}
              >
                <EditIcon /> Edit
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  renderInfoCard(): Array<JSX.Element> {
    const statusCapitalized = this.stringCapitalized(this.props.PTOInfo.status);
    const PTOInfo = {
      from: this.props.PTOInfo.from_date,
      to: this.props.PTOInfo.to_date,
      status: statusCapitalized,
      comment: this.props.PTOInfo.comment,
    };
    return Object.entries(PTOInfo).map((field) => {
      const [key, value] = field;
      const keyCapitalized = this.stringCapitalized(key);
      return (
        <Grid item xs={12} key={key}>
          <Card className="ptobasicinfo-small-card">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="h6" gutterBottom>
                    <b>{keyCapitalized}</b>
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h6" gutterBottom>
                    {value}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      );
    });
  }

  renderUser(users: Array<UserInfoType>, fieldType: string): JSX.Element {
    const userChips = users.map((user) => (
      <Chip
        key={user.id}
        className="ptobasicinfo-chip"
        avatar={<Avatar className="ptobasicinfo-chip-avatar" alt={user.firstName[0]} src={user.picture} />}
        label={user.email}
        variant="outlined"
      />
    ));
    return (
      <Grid item xs={12}>
        <Card className="ptobasicinfo-small-card">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="h6" gutterBottom>
                  <b>{fieldType}</b>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                {userChips}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }

  private stringCapitalized(string: string): string {
    if (string.length > 0) {
      return string[0].toUpperCase() + string.substring(1);
    } else {
      return string;
    }
  }
}

export default withRouter(PTOBasicInfo);
