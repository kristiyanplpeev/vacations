import React, { Component } from "react";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import DescriptionIcon from "@material-ui/icons/Description";
import EditIcon from "@material-ui/icons/Edit";
import "./PTOCard.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RouteComponentProps, withRouter } from "react-router";

import { PTOStatus } from "common/constants";
import { IUserPTO, IUser } from "common/types";
import MyDocument from "components/PTODetails/PDFDocu/AtscaleLeaveRequest";

interface PTOCardProps extends RouteComponentProps {
  PTOInfo: IUserPTO;
  employee: IUser;
  approvers: Array<IUser>;
  workingDays: number;
}

interface PTOCardState {
  anchorEl: any;
  disableEditButton: boolean;
}

class PTOCard extends Component<PTOCardProps, PTOCardState> {
  constructor(props: PTOCardProps) {
    super(props);
    this.state = {
      anchorEl: null,
      disableEditButton: false,
    };
  }

  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <Typography className="pto-card-header" variant="h5" component="h2">
            Details
          </Typography>
          {this.renderUser([this.props.employee], "Employee")}
          {this.renderInfoCard()}
          {this.renderUser(this.props.approvers, "Approvers")}
          {this.renderButtons()}
        </CardContent>
      </Card>
    );
  }

  renderInfoCard(): Array<JSX.Element> {
    const statusCapitalized = this.stringCapitalize(this.props.PTOInfo.status);
    const PTOInfo = {
      from: this.props.PTOInfo.from_date,
      to: this.props.PTOInfo.to_date,
      status: statusCapitalized,
      comment: this.props.PTOInfo.comment,
    };
    return Object.entries(PTOInfo).map((field) => {
      const [key, value] = field;
      const keyCapitalized = this.stringCapitalize(key);
      return (
        <Grid item xs={12} key={key}>
          <Card className="pto-card-small-card">
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

  renderUser(users: Array<IUser>, fieldType: string): JSX.Element {
    const userChips = users.map((user) => (
      <Chip
        key={user.id}
        className="pto-card-chip"
        avatar={<Avatar className="pto-card-chip-avatar" alt={user.firstName[0]} src={user.picture} />}
        label={user.email}
        variant="outlined"
      />
    ));
    return (
      <Grid item xs={12}>
        <Card className="pto-card-small-card">
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

  // eslint-disable-next-line max-lines-per-function
  renderButtons(): JSX.Element {
    return (
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Button
            className="pto-card-buttons"
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
            <Button className="pto-card-buttons" variant="outlined" color="primary">
              <DescriptionIcon /> Generate pdf
            </Button>
          </PDFDownloadLink>
        </Grid>
        <Grid item xs={4}>
          <Button
            className="pto-card-buttons"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => this.handleEditClick(event)}
            variant="outlined"
            color="primary"
            disabled={this.state.disableEditButton}
          >
            <EditIcon /> Edit
          </Button>
          {this.renderPopover()}
        </Grid>
      </Grid>
    );
  }

  renderPopover(): JSX.Element {
    return (
      <Popover
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

  handleEditClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (this.props.PTOInfo.status === PTOStatus.requested) {
      this.props.history.push(`/edit/${this.props.PTOInfo.id}`);
    } else {
      this.setState({
        anchorEl: event.currentTarget,
        disableEditButton: true,
      });
    }
  }
  handlePopoverClose(): void {
    this.setState({
      anchorEl: null,
    });
  }

  private stringCapitalize(string: string): string {
    if (string.length > 0) {
      return string[0].toUpperCase() + string.substring(1);
    } else {
      return string;
    }
  }
}

export default withRouter(PTOCard);
