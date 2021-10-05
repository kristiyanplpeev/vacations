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
import "./AbsenceCard.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RouteComponentProps, withRouter } from "react-router";

import { IUserAbsence, IUser } from "common/interfaces";
import { StringUtil } from "common/StringUtil";
import MyDocument from "components/AbsenceDetails/PDFDocu/AtscaleLeaveRequest";

interface AbsenceCardProps extends RouteComponentProps {
  absenceDetails: IUserAbsence;
  employee: IUser;
  workingDays: number;
}

class AbsenceCard extends Component<AbsenceCardProps> {
  constructor(props: AbsenceCardProps) {
    super(props);
  }

  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <Typography className="absence-card-header" variant="h5" component="h2">
            Details
          </Typography>
          {this.renderEmployee(this.props.employee)}
          {this.renderInfoCard()}
          {this.renderButtons()}
        </CardContent>
      </Card>
    );
  }

  renderInfoCard(): Array<JSX.Element> {
    const absenceDetails = {
      type: this.props.absenceDetails.type,
      from: this.props.absenceDetails.from_date,
      to: this.props.absenceDetails.to_date,
      comment: this.props.absenceDetails.comment,
    };
    return Object.entries(absenceDetails).map((field) => {
      const [key, value] = field;
      const keyCapitalized = this.stringCapitalize(key);
      if (!value) {
        return <></>;
      }
      return (
        <Grid item xs={12} key={key}>
          <Card className="absence-card-small-card">
            <CardContent className="absence-card-content">
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

  renderEmployee(user: IUser): JSX.Element {
    return (
      <Grid item xs={12}>
        <Card className="absence-card-small-card">
          <CardContent className="absence-card-content">
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="h6" gutterBottom>
                  <b>Employee</b>
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Chip
                  className="absence-card-chip"
                  avatar={<Avatar className="absence-card-chip-avatar" alt={user.firstName[0]} src={user.picture} />}
                  label={user.email}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  }

  // eslint-disable-next-line max-lines-per-function
  renderButtons(): JSX.Element {
    return (
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Button
            className="absence-card-buttons"
            variant="outlined"
            color="secondary"
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
                absenceDetails={this.props.absenceDetails}
                workingDays={this.props.workingDays}
              />
            }
            fileName={`${this.props.employee.firstName} ${this.props.employee.lastName} Vacation.pdf`}
          >
            <Button className="absence-card-buttons" variant="outlined" color="primary">
              <DescriptionIcon /> Generate pdf
            </Button>
          </PDFDownloadLink>
        </Grid>
        <Grid item xs={4}>
          <Button
            className="absence-card-buttons"
            onClick={() => this.handleEditClick()}
            variant="outlined"
            color="primary"
          >
            <EditIcon /> Edit
          </Button>
        </Grid>
      </Grid>
    );
  }

  handleEditClick(): void {
    const absenceType = StringUtil.zipString(this.props.absenceDetails.type);
    this.props.history.push(`/edit/${absenceType}/${this.props.absenceDetails.id}`);
  }

  private stringCapitalize(string: string): string {
    if (string.length > 0) {
      return string[0].toUpperCase() + string.substring(1);
    } else {
      return string;
    }
  }
}

export default withRouter(AbsenceCard);
