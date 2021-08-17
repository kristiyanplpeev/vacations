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
import { RouteComponentProps, withRouter } from "react-router";

import { ITextBox, OptionalWithNull } from "common/types";
import "./PTOForm.css";

interface PTOFormProps extends RouteComponentProps {
  loading: boolean;
  startingDate: string;
  endingDate: string;
  comment: ITextBox;
  approvers: ITextBox;
  warning: string;
  successMessage: boolean;
  addPTO: () => Promise<void>;
  handleCommentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleApproversChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setStartingDate: (date: MaterialUiPickersDate, value: OptionalWithNull<string>) => Promise<void>;
  setEndingDate: (date: MaterialUiPickersDate, value: OptionalWithNull<string>) => Promise<void>;
}

class PTOForm extends Component<PTOFormProps> {
  constructor(props: PTOFormProps) {
    super(props);
  }
  // eslint-disable-next-line max-lines-per-function
  render(): JSX.Element {
    return (
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography className="pto-form-header card-content" variant="h5" component="h2">
                Details
              </Typography>
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
              <Grid item xs={12}>
                <TextField
                  className="pto-form-text-fields card-content"
                  error={this.props.comment.textBoxInvalid}
                  id="outlined-multiline-static"
                  label="Comments"
                  value={this.props.comment.value}
                  onChange={this.props.handleCommentChange}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className="pto-form-text-fields card-content"
                  error={this.props.approvers.textBoxInvalid}
                  id="outlined-multiline-static"
                  label="Approvers"
                  value={this.props.approvers.value}
                  onChange={this.props.handleApproversChange}
                  placeholder="comma separated emails of the approvers"
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                {this.props.warning && !this.props.successMessage ? (
                  <Alert className="pto-form-warning card-content" data-unit-test="warning-message" severity="warning">
                    {this.props.loading ? <CircularProgress /> : this.props.warning}
                  </Alert>
                ) : null}
              </Grid>
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
                    onClick={this.props.addPTO}
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
          open={this.props.successMessage}
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
}

export default withRouter(PTOForm);
