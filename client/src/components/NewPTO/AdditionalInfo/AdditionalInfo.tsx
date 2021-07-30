import React, { Component } from "react";

import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
import { RouteComponentProps, withRouter } from "react-router";

import AppError from "common/AppError/AppError";
import { TextFieldType } from "common/types";
import { HolidaysServiceInterface } from "inversify/interfaces";
import "./AdditionalInfo.css";

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
  holidaysService: HolidaysServiceInterface;
}

class AdditionalInfo extends Component<AdditionalInfoProps, AdditionalInfoState> {
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
    if (this.state.loading) {
      return <CircularProgress />;
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
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
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
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
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          {this.state.warning && <Alert severity="warning">{this.state.warning}</Alert>}
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Button
            className="additionalinfo-buttons"
            variant="outlined"
            color="primary"
            onClick={() => this.props.history.push("/home")}
          >
            Cancel
          </Button>
          <Button className="additionalinfo-buttons" variant="outlined" color="primary" onClick={() => this.addPTO()}>
            Add
          </Button>
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
      const warning = await this.props.holidaysService.addPTORequest(holidayInfo);
      if (warning && "warning" in warning) {
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
    return areInputsValid;
  };
}

export default withRouter(AdditionalInfo);
