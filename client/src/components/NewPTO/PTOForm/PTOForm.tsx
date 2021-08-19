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

import { IPTO, ITextBox, OptionalWithNull } from "common/types";
import { ValidationUtil } from "common/ValidationUtil";
import "./PTOForm.css";
import { IPTOService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface PTOFormState {
  comment: ITextBox;
  approvers: ITextBox;
  warning: string;
  successMessage: boolean;
  loading: boolean;
}

interface PTOFormProps extends RouteComponentProps {
  startingDate: string;
  endingDate: string;
  setStartingDate: (date: MaterialUiPickersDate, value: OptionalWithNull<string>) => Promise<void>;
  setEndingDate: (date: MaterialUiPickersDate, value: OptionalWithNull<string>) => Promise<void>;
  setError: (errorState: boolean) => void;
}

export class PTOForm extends Component<PTOFormProps, PTOFormState> {
  @resolve(TYPES.PTO) private PTOService!: IPTOService;

  constructor(props: PTOFormProps) {
    super(props);
    this.state = {
      loading: false,
      warning: "",
      successMessage: false,
      comment: {
        value: "PTO",
        isValid: true,
        validate: (value) => value.length >= 1 && value.length <= 1000,
        errorText: "Comment is mandatory.",
        textBoxInvalid: false,
      },
      approvers: {
        value: "",
        isValid: false,
        validate: (value) => value.length > 0 && this.isApproversValid(value),
        errorText: "One or more approvers separated with comma must be provided.",
        textBoxInvalid: false,
      },
    };
  }

  render(): JSX.Element {
    return (
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography className="pto-form-header card-content" variant="h5" component="h2">
                Details
              </Typography>
              {this.renderDatePickers()}
              {this.renderTextFields()}
              {this.renderWarning()}
              {this.renderButtons()}
            </CardContent>
          </Card>
        </Grid>
        {this.renderSnackbar()}
      </Grid>
    );
  }

  renderDatePickers(): JSX.Element {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid item xs={12}>
          <KeyboardDatePicker
            className="pto-form-datepicker card-content"
            margin="normal"
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
            className="pto-form-datepicker card-content"
            margin="normal"
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
    );
  }

  renderTextFields(): JSX.Element {
    return (
      <>
        <Grid item xs={12}>
          <TextField
            className="pto-form-text-fields card-content"
            error={this.state.comment.textBoxInvalid}
            id="outlined-multiline-static"
            label="Comments"
            value={this.state.comment.value}
            onChange={this.handleCommentChange}
            multiline
            rows={4}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            data-unit-test="approvers-input"
            className="pto-form-text-fields card-content"
            error={this.state.approvers.textBoxInvalid}
            id="outlined-multiline-static"
            label="Approvers"
            value={this.state.approvers.value}
            onChange={this.handleApproversChange}
            placeholder="comma separated emails of the approvers"
            multiline
            rows={4}
            variant="outlined"
          />
        </Grid>
      </>
    );
  }

  renderWarning(): JSX.Element {
    return (
      <Grid item xs={12}>
        {this.state.warning && !this.state.successMessage ? (
          <Alert className="pto-form-warning card-content" data-unit-test="warning-message" severity="warning">
            {this.state.loading ? <CircularProgress /> : this.state.warning}
          </Alert>
        ) : null}
      </Grid>
    );
  }

  renderButtons(): JSX.Element {
    return (
      <Grid container spacing={3}>
        <Grid item xs={2}></Grid>
        <Grid item xs={4}>
          <Button
            className="pto-form-buttons"
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
            className="pto-form-buttons"
            variant="outlined"
            color="primary"
            onClick={this.addPTO}
          >
            Add
          </Button>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    );
  }

  renderSnackbar(): JSX.Element {
    return (
      <Snackbar
        open={this.state.successMessage}
        onClose={() => this.props.history.push("/home")}
        autoHideDuration={2000}
      >
        <Alert onClose={() => this.props.history.push("/home")} severity="success">
          Your PTO has been successfully submitted!
        </Alert>
      </Snackbar>
    );
  }

  addPTO = async (): Promise<void> => {
    if (!this.areInputsValid()) return;
    this.setState({
      loading: true,
    });
    try {
      const PTODetails = this.getHoliday();
      const warning = await this.PTOService.addPTO(PTODetails);
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
      this.props.setError(true);
    }
    this.setState({
      loading: false,
    });
  };

  private getHoliday(): IPTO {
    const approversArr = this.formatApprovers(this.state.approvers.value);

    return {
      startingDate: this.props.startingDate,
      endingDate: this.props.endingDate,
      comment: this.state.comment.value,
      approvers: approversArr,
    };
  }

  areInputsValid = (): boolean => {
    let areInputsValid = true;
    if (!this.state.comment.isValid) {
      this.setState({
        comment: { ...this.state.comment, textBoxInvalid: true },
        warning: this.state.comment.errorText,
      });
      areInputsValid = false;
    } else {
      this.setState({
        comment: { ...this.state.comment, textBoxInvalid: false },
      });
    }
    if (!this.state.approvers.isValid) {
      this.setState({
        approvers: { ...this.state.approvers, textBoxInvalid: true },
        warning: this.state.approvers.errorText,
      });
      areInputsValid = false;
    } else {
      this.setState({
        approvers: { ...this.state.approvers, textBoxInvalid: false },
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

  private formatApprovers(approversValue: string): Array<string> {
    return approversValue
      .replace(/ /g, "")
      .split(",")
      .filter((elem) => elem.length > 0);
  }

  private isApproversValid(approversValue: string): boolean {
    const approversArr = this.formatApprovers(approversValue);
    return approversArr.every((el) => ValidationUtil.isEmail(el));
  }

  handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      comment: {
        ...this.state.comment,
        value: event.target.value,
        isValid: this.state.comment.validate(event.target.value),
      },
    });
  };

  handleApproversChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      approvers: {
        ...this.state.approvers,
        value: event.target.value,
        isValid: this.state.approvers.validate(event.target.value),
      },
    });
  };
}

export default withRouter(PTOForm);
