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

import AppError from "common/AppError/AppError";
import { TextFieldType } from "common/types";
import { HolidaysServiceInterface } from "inversify/interfaces";
import "./AdditionalInfo.css";
import { TYPES } from "inversify/types";

interface AdditionalInfoState {
  warning: string | null;
  commentInputInvalid: boolean;
  approversInputInvalid: boolean;
  successMessage: boolean;
  loading: boolean;
  error: boolean | string;
}

interface AdditionalInfoProps extends RouteComponentProps {
  startingDate: string;
  endingDate: string;
  comment: TextFieldType;
  approvers: TextFieldType;
  handleCommentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleApproversChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setStartingDate: (date: MaterialUiPickersDate, value: string | null | undefined) => Promise<void>;
  setEndingDate: (date: MaterialUiPickersDate, value: string | null | undefined) => Promise<void>;
}

class AdditionalInfo extends Component<AdditionalInfoProps, AdditionalInfoState> {
  @resolve(TYPES.Holidays) private holidaysService!: HolidaysServiceInterface;

  constructor(props: AdditionalInfoProps) {
    super(props);
    this.state = {
      warning: null,
      commentInputInvalid: false,
      approversInputInvalid: false,
      successMessage: false,
      loading: false,
      error: false,
    };
  }
  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    if (this.state.error) {
      return <AppError message={this.state.error} />;
    }
    return (
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography className="additionalInfo-header" variant="h5" component="h2">
                Details
              </Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={12}>
                  <KeyboardDatePicker
                    className="additionalinfo-datepicker"
                    margin="normal"
                    id="date-picker-dialog"
                    label="From:"
                    format="yyyy/MM/dd"
                    value={this.props.startingDate}
                    onChange={(date: MaterialUiPickersDate, value: string | null | undefined) =>
                      this.props.setStartingDate(date, value)
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <KeyboardDatePicker
                    className="additionalinfo-datepicker"
                    margin="normal"
                    id="date-picker-dialog"
                    label="To:"
                    format="yyyy/MM/dd"
                    value={this.props.endingDate}
                    onChange={(date: MaterialUiPickersDate, value: string | null | undefined) =>
                      this.props.setEndingDate(date, value)
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <Grid item xs={12}>
                <TextField
                  className="additionalinfo-textfields"
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
                  className="additionalinfo-textfields"
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
                {this.state.warning && (
                  <Alert className="additionalinfo-warning" data-unit-test="warning-message" severity="warning">
                    {this.state.loading ? <CircularProgress /> : this.state.warning}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  className="additionalinfo-buttons"
                  variant="outlined"
                  color="primary"
                  onClick={() => this.props.history.push("/home")}
                >
                  Cancel
                </Button>
                <Button
                  data-unit-test="addPTO-button"
                  className="additionalinfo-buttons"
                  variant="outlined"
                  color="primary"
                  onClick={() => this.addPTO()}
                >
                  Add
                </Button>
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
      const approversArr = this.props.approvers.value
        .replace(/ /g, "")
        .split(",")
        .filter((elem) => elem.length > 0);

      const holidayInfo = {
        startingDate: this.props.startingDate,
        endingDate: this.props.endingDate,
        comment: this.props.comment.value,
        approvers: approversArr,
      };
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
