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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import "./AbsenceCard.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { resolve } from "inversify-react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";

import { leaveTypesWithURLs } from "common/constants";
import { IUserAbsence, IUser } from "common/interfaces";
import { StringUtil } from "common/StringUtil";
import MyDocument from "components/AbsenceDetails/PDFDocu/AtscaleLeaveRequest";
import DeleteAbsenceModal from "components/common/DeleteAbsenceModal/DeleteAbsenceModal";
import { IAbsenceService } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import { ApplicationState, IUserState } from "store/user/types";

interface AbsenceCardProps extends RouteComponentProps, LinkStateProps {
  absenceDetails: IUserAbsence;
  employee: IUser;
  workingDays: number;
  setError: (error: string) => void;
}

interface AbsenceCardState {
  deleteAbsenceId: string;
}

class AbsenceCard extends Component<AbsenceCardProps, AbsenceCardState> {
  @resolve(TYPES.Absence) private absenceService!: IAbsenceService;

  constructor(props: AbsenceCardProps) {
    super(props);
    this.state = {
      deleteAbsenceId: "",
    };
  }

  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    return (
      <div>
        <Card>
          <CardContent>
            {this.renderDeleteButton()}
            <Typography className="absence-card-header" variant="h5" component="h2">
              Details
            </Typography>
            {this.renderEmployee(this.props.employee)}
            {this.renderInfoCard()}
            {this.renderButtons()}
          </CardContent>
        </Card>
        {this.renderDeleteAbsenceConfirmationModal()}
      </div>
    );
  }

  renderInfoCard(): Array<JSX.Element> {
    const absenceDetails = {
      type: this.props.absenceDetails.type,
      from: this.props.absenceDetails.startingDate,
      to: this.props.absenceDetails.endingDate,
      comment: this.props.absenceDetails.comment,
    };
    return Object.entries(absenceDetails).map((field) => {
      const [key, value] = field;
      const keyCapitalized = StringUtil.stringCapitalize(key);
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
          {this.isLoggedUserOwnerOfTheAbsence() && (
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
          )}
        </Grid>
        <Grid item xs={4}>
          {this.isLoggedUserOwnerOfTheAbsence() && (
            <Button
              className="absence-card-buttons"
              onClick={() => this.handleEditClick()}
              variant="outlined"
              color="primary"
            >
              <EditIcon /> Edit
            </Button>
          )}
        </Grid>
      </Grid>
    );
  }

  renderDeleteButton(): JSX.Element {
    return (
      <>
        {this.isLoggedUserOwnerOfTheAbsence() && (
          <Button
            className="absence-card-buttons-delete"
            onClick={() => this.handleDeleteClick(this.props.absenceDetails.id)}
            variant="outlined"
            color="secondary"
          >
            <DeleteOutlineIcon /> Delete
          </Button>
        )}
      </>
    );
  }

  renderDeleteAbsenceConfirmationModal(): JSX.Element {
    return (
      <DeleteAbsenceModal
        deleteAbsenceId={this.state.deleteAbsenceId}
        handleCancelClick={this.handleCancelClick}
        handleConfirmClick={this.handleConfirmClick}
      />
    );
  }

  handleDeleteClick(absenceId: string): void {
    this.setState({
      deleteAbsenceId: absenceId,
    });
  }

  handleCancelClick = (): void => {
    this.setState({
      deleteAbsenceId: "",
    });
  };

  handleConfirmClick = async (currentAbsenceId: string): Promise<void> => {
    try {
      await this.absenceService.deleteAbsence(currentAbsenceId);
      this.props.history.push("/home");
    } catch (error) {
      this.props.setError(error.message);
    }
  };

  handleEditClick(): void {
    const absenceUrl = Object.values(leaveTypesWithURLs).find(
      (absence) => absence.leave === this.props.absenceDetails.type,
    );
    if (!absenceUrl) {
      this.props.setError("Selected type is not supported");
      return;
    }
    this.props.history.push(`/edit/${absenceUrl.url}/${this.props.absenceDetails.id}`);
  }

  isLoggedUserOwnerOfTheAbsence(): boolean {
    return this.props.userInfo.user.sub === this.props.employee.id;
  }
}

interface LinkStateProps {
  userInfo: IUserState;
}

const mapStateToProps = ({ userInfoReducer }: ApplicationState): LinkStateProps => {
  return {
    userInfo: userInfoReducer,
  };
};

export default connect(mapStateToProps)(withRouter(AbsenceCard));
