import React, { Component } from "react";

import DateFnsUtils from "@date-io/date-fns";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { resolve } from "inversify-react";
import { RouteComponentProps, StaticContext, withRouter } from "react-router";

import { errMessage } from "common/constants";
import { IPTO, ITextBox, IUser, OptionalWithNull } from "common/types";
import { ValidationUtil } from "common/ValidationUtil";
import "./PTOForm.css";
import { IPTOService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

export interface PTOFormMatchProps {
  id: string;
}
interface PTOFormState {
  comment: ITextBox;
  approvers: ITextBox;
  warning: string;
  modalError: string;
  loading: boolean;
  loadingEditMode: boolean;
}

interface PTOFormProps extends RouteComponentProps<PTOFormMatchProps, StaticContext, { showSnackbar: boolean }> {
  startingDate: string;
  endingDate: string;
  setStartingDate: (date: Date | null, value: OptionalWithNull<string>) => Promise<void>;
  setEndingDate: (date: Date | null, value: OptionalWithNull<string>) => Promise<void>;
  setError: (errorState: boolean) => void;
  editMode: () => boolean;
}

export class PTOForm extends Component<PTOFormProps, PTOFormState> {
  @resolve(TYPES.PTO) private PTOService!: IPTOService;

  constructor(props: PTOFormProps) {
    super(props);
    this.state = {
      loading: false,
      loadingEditMode: false,
      warning: "",
      modalError: "",
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

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async componentDidMount(): Promise<void> {
    if (this.props.editMode()) {
      this.setState({
        loadingEditMode: true,
      });
      try {
        const PTODetailed = await this.PTOService.getRequestedPTOById(this.props.match.params.id);
        const approversValue = this.getApproversAsString(PTODetailed.approvers);
        this.props.setStartingDate(new Date(PTODetailed.from_date), PTODetailed.from_date);
        this.props.setEndingDate(new Date(PTODetailed.to_date), PTODetailed.to_date);
        this.setState({
          comment: { ...this.state.comment, value: PTODetailed.comment },
          approvers: { ...this.state.approvers, value: approversValue, isValid: true },
        });
      } catch (error) {
        if (error.message === errMessage) {
          this.props.setError(true);
        } else {
          this.setState({
            modalError: error.message,
          });
        }
      }
      this.setState({
        loadingEditMode: false,
      });
    }
  }

  render(): JSX.Element {
    if (this.state.loadingEditMode) {
      return <CircularProgress />;
    }
    return (
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Card className="pto-form-paper">
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
        {this.renderModal()}
      </Grid>
    );
  }

  renderModal(): JSX.Element {
    return (
      <Modal
        open={!!this.state.modalError}
        onClose={() => this.handleModalClose()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="error-modal">
          <Typography variant="subtitle1" gutterBottom>
            {this.state.modalError}
          </Typography>
          <Button onClick={() => this.handleModalClose()} className="error-modal-button" variant="outlined">
            OK
          </Button>
        </div>
      </Modal>
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
        {this.state.warning && (
          <Alert className="pto-form-warning card-content" data-unit-test="warning-message" severity="error">
            {this.state.loading ? <CircularProgress /> : this.state.warning}
          </Alert>
        )}
      </Grid>
    );
  }

  // eslint-disable-next-line max-lines-per-function
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
          {this.props.editMode() ? (
            <Button className="pto-form-buttons" variant="outlined" color="primary" onClick={this.editPTO}>
              Save
            </Button>
          ) : (
            <Button
              data-unit-test="addPTO-button"
              className="pto-form-buttons"
              variant="outlined"
              color="primary"
              onClick={this.addPTO}
            >
              Add
            </Button>
          )}
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
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
          loading: false,
        });
        this.setApproversInputError(warning.warning);
      } else {
        this.props.history.push({ pathname: "/home", state: { showSnackbar: true } });
      }
    } catch (error) {
      this.props.setError(true);
    }
  };

  editPTO = async (): Promise<void> => {
    if (!this.areInputsValid()) return;
    try {
      this.setState({
        loading: true,
      });
      const PTOId = this.props.match.params.id;
      const PTO = { ...this.getHoliday(), id: PTOId };

      await this.PTOService.editPTO(PTO);
      this.props.history.push({ pathname: "/home", state: { showSnackbar: true } });
    } catch (error) {
      if (error.message === errMessage) {
        this.props.setError(true);
      } else {
        this.setState({
          warning: error.message,
          loading: false,
        });
        this.setApproversInputError(error.message);
      }
    }
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

  handleModalClose(): void {
    this.setState({
      modalError: "",
    });
    this.props.history.push("/home");
  }

  areInputsValid = (): boolean => {
    if (!this.state.comment.isValid) {
      this.setState({
        comment: { ...this.state.comment, textBoxInvalid: true },
        approvers: { ...this.state.approvers, textBoxInvalid: false },
        warning: this.state.comment.errorText,
      });
      return false;
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
      return false;
    } else {
      this.setState({
        approvers: { ...this.state.approvers, textBoxInvalid: false },
      });
    }
    if (this.props.startingDate > this.props.endingDate) {
      this.setState({
        warning: "Starting date must not be after ending date",
      });
      return false;
    }
    return true;
  };

  private setApproversInputError(warning: string): void {
    if (warning.includes("@")) {
      this.setState({
        approvers: { ...this.state.approvers, textBoxInvalid: true },
      });
    }
  }

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

  private getApproversAsString(approvers: Array<IUser>): string {
    return approvers.reduce((acc, el, index) => {
      if (index === 0) {
        return el.email;
      }
      return `${acc}, ${el.email}`;
    }, "");
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