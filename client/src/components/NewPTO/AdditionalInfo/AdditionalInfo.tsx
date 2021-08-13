import React, { Component } from "react";

import DateFnsUtils from "@date-io/date-fns";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { resolve } from "inversify-react";
import { RouteComponentProps, withRouter } from "react-router";

import Error from "common/AppError/Error";
import { IHolidayFullInfo, TextFieldType } from "common/types";
import { IHolidaysService } from "inversify/interfaces";
import "./AdditionalInfo.css";
import { TYPES } from "inversify/types";

type OptionalWithNull<T> = T | null | undefined;

interface AdditionalInfoState {
  warning: string;
  commentInputInvalid: boolean;
  approversInputInvalid: boolean;
  successMessage: boolean;
  loading: boolean;
  error: string;
}

interface AdditionalInfoProps extends RouteComponentProps {
  startingDate: string;
  endingDate: string;
  comment: TextFieldType;
  approvers: TextFieldType;
  handleCommentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleApproversChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setStartingDate: (date: MaterialUiPickersDate, value: OptionalWithNull<string>) => Promise<void>;
  setEndingDate: (date: MaterialUiPickersDate, value: OptionalWithNull<string>) => Promise<void>;
}

class AdditionalInfo extends Component<AdditionalInfoProps, AdditionalInfoState> {
  @resolve(TYPES.Holidays) private holidaysService!: IHolidaysService;

  constructor(props: AdditionalInfoProps) {
    super(props);
    this.state = {
      warning: "",
      commentInputInvalid: false,
      approversInputInvalid: false,
      successMessage: false,
      loading: false,
      error: "",
    };
  }
  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    if (this.state.error) {
      return <Error />;
    }
    return (
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography className="additionalInfo-header additionalinfo-card-content" variant="h5" component="h2">
                Details
              </Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={12}>
                  <KeyboardDatePicker
                    className="additional-info-datepicker additionalinfo-card-content"
                    margin="normal"
                    id="date-picker-dialog"
                    label="From:"
                    format="yyyy/MM/dd"
                    value={this.props.startingDate}
                    onChange={this.props.setStartingDate}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <KeyboardDatePicker
                    className="additional-info-datepicker additionalinfo-card-content"
                    margin="normal"
                    id="date-picker-dialog"
                    label="To:"
                    format="yyyy/MM/dd"
                    value={this.props.endingDate}
                    onChange={this.props.setEndingDate}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <Grid item xs={12}>
                <TextField
                  className="additionalinfo-textfields additionalinfo-card-content"
                  error={this.state.commentInputInvalid}
                  id="outlined-multiline-static"
                  label="Comments"
                  value={this.props.comment.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.props.handleCommentChange(e)}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className="additionalinfo-textfields additionalinfo-card-content"
                  error={this.state.approversInputInvalid}
                  id="outlined-multiline-static"
                  label="Approvers"
                  value={this.props.approvers.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.props.handleApproversChange(e)}
                  placeholder="comma separated emails of the approvers"
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                {this.state.warning && !this.state.successMessage ? (
                  <Alert
                    className="additionalinfo-warning additionalinfo-card-content"
                    data-unit-test="warning-message"
                    severity="warning"
                  >
                    {this.state.loading ? <CircularProgress /> : this.state.warning}
                  </Alert>
                ) : null}
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={2}></Grid>
                <Grid item xs={4}>
                  <Button
                    className="additionalinfo-buttons"
                    variant="outlined"
                    color="primary"
                    onClick={() => this.props.history.push("/home")}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    data-unit-test="addPTO-button"
                    className="additionalinfo-buttons"
                    variant="outlined"
                    color="primary"
                    onClick={this.addPTO}
                  >
                    Add
                  </Button>
                </Grid>
                <Grid item xs={2}></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Snackbar
          open={this.state.successMessage}
          onClose={() => this.props.history.push("/home")}
          autoHideDuration={2000}
        >
          <Alert onClose={() => this.props.history.push("/home")} severity="success">
            Your PTO has been successfully submitted!
          </Alert>
        </Snackbar>
      </Grid>
    );
  }

  addPTO = async (): Promise<void> => {
    if (!this.areInputsValid()) return;
    this.setState({
      loading: true,
    });
    try {
      const holidayInfo = this.formatHolidayInfoAsObj();
      const warning = await this.holidaysService.addPTORequest(holidayInfo);
      if (warning && warning.warning) {
        this.setState({
          warning: warning.warning,
        });
      } else {
        this.setState({
          successMessage: true,
        });
      }
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
    this.setState({
      loading: false,
    });
  };

  private formatHolidayInfoAsObj(): IHolidayFullInfo {
    const approversArr = this.props.approvers.value
      .replace(/ /g, "")
      .split(",")
      .filter((elem) => elem.length > 0);

    return {
      startingDate: this.props.startingDate,
      endingDate: this.props.endingDate,
      comment: this.props.comment.value,
      approvers: approversArr,
    };
  }

  areInputsValid = (): boolean => {
    let areInputsValid = true;
    if (!this.props.comment.isValid) {
      this.setState({
        commentInputInvalid: true,
        warning: this.props.comment.errorText,
      });
      areInputsValid = false;
    } else {
      this.setState({
        commentInputInvalid: false,
      });
    }
    if (!this.props.approvers.isValid) {
      this.setState({
        approversInputInvalid: true,
        warning: this.props.approvers.errorText,
      });
      areInputsValid = false;
    } else {
      this.setState({
        approversInputInvalid: false,
      });
    }
    if (this.props.startingDate > this.props.endingDate) {
      this.setState({
        warning: "Starting date must not be after ending date",
      });
      areInputsValid = false;
    }
    return areInputsValid;
  };
}

export default withRouter(AdditionalInfo);
