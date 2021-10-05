import React, { Component } from "react";

import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import { KeyboardDatePicker } from "@material-ui/pickers/DatePicker";
import MuiPickersUtilsProvider from "@material-ui/pickers/MuiPickersUtilsProvider";
import { resolve } from "inversify-react";
import { RouteComponentProps, StaticContext } from "react-router";

import { AbsencesEnum, errMessage } from "common/constants";
import { DateUtil } from "common/DateUtil";
import { ITextBox, OptionalWithNull } from "common/interfaces";
import { StringUtil } from "common/StringUtil";
import ButtonWithLoader from "components/common/ButtonWithLoader/ButtonWithLoader";
import { IAbsenceService } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import "./AbsenceForm.css";

export interface AbsenceFormMatchProps {
  id: string;
  type: string;
}

export default class AbsenceFactory {
  static create(absenceType: string): React.ComponentType<AbsenceFormProps> {
    if (
      absenceType === StringUtil.zipString(AbsencesEnum.weddingLeave) ||
      absenceType === StringUtil.zipString(AbsencesEnum.bereavementLeave) ||
      absenceType === StringUtil.zipString(AbsencesEnum.bloodDonationLeave)
    ) {
      return AbsenceWithCalculatedEndDate;
    } else if (
      absenceType === StringUtil.zipString(AbsencesEnum.paidLeave) ||
      absenceType === StringUtil.zipString(AbsencesEnum.unpaidLeave)
    ) {
      return PaidAndUnpaid;
    } else if (absenceType === StringUtil.zipString(AbsencesEnum.courtLeave)) {
      return Court;
    }
    throw new Error("Invalid absence type.");
  }
}

interface AbsenceFormState {
  loadingOnMount: boolean;
  comment: ITextBox;
  warning: string;
  loadingButton: boolean;
}

interface AbsenceFormProps
  extends RouteComponentProps<AbsenceFormMatchProps, StaticContext, { showSnackbar: boolean }> {
  startingDate: string;
  endingDate: string;
  setStartingDate: (
    date: Date | null,
    value: OptionalWithNull<string>,
    isEndDateDisabled: boolean,
    type: AbsencesEnum,
  ) => Promise<void>;
  setEndingDate: (date: Date | null, value: OptionalWithNull<string>) => Promise<void>;
  setError: (errorMessage: string) => void;
  editMode: () => boolean;
}

export abstract class AbsenceForm extends Component<AbsenceFormProps, AbsenceFormState> {
  @resolve(TYPES.Absence) protected readonly AbsenceService!: IAbsenceService;

  constructor(props: AbsenceFormProps) {
    super(props);
    this.state = {
      loadingButton: false,
      loadingOnMount: false,
      warning: "",
      comment: {
        value: "Out of office",
        isValid: true,
        validate: (value: string) => value.length >= 1 && value.length <= 1000,
        errorText: "Comment is mandatory.",
        textBoxInvalid: false,
      },
    };
  }

  async componentDidMount(): Promise<void> {
    if (this.props.editMode()) {
      this.setState({
        loadingOnMount: true,
      });
      try {
        const absenceDetailed = await this.AbsenceService.getRequestedAbsenceById(this.props.match.params.id);
        this.props.setStartingDate(
          new Date(absenceDetailed.from_date),
          absenceDetailed.from_date,
          false,
          this.getAbsenceType(),
        );
        this.props.setEndingDate(new Date(absenceDetailed.to_date), absenceDetailed.to_date);
        this.setState({
          comment: { ...this.state.comment, value: absenceDetailed.comment },
        });
      } catch (error) {
        this.props.setError(error.message);
      }
      this.setState({
        loadingOnMount: false,
      });
    }
  }

  protected renderDateInputs(toDateDisable: boolean): JSX.Element {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid item xs={12}>
          <KeyboardDatePicker
            data-unit-test="warning-message"
            className="absence-form-datepicker card-content"
            margin="normal"
            label="From:"
            format="yyyy-MM-dd"
            value={this.props.startingDate}
            onChange={(date: Date | null, value: OptionalWithNull<string>) =>
              this.props.setStartingDate(date, value, toDateDisable, this.getAbsenceType())
            }
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <KeyboardDatePicker
            disabled={toDateDisable}
            className="absence-form-datepicker card-content"
            margin="normal"
            label="To:"
            format="yyyy-MM-dd"
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

  protected renderWarning(): JSX.Element {
    return (
      <Grid item xs={12}>
        {this.state.warning && (
          <Alert className="absence-form-warning card-content" data-unit-test="warning-message" severity="error">
            {this.state.warning}
          </Alert>
        )}
      </Grid>
    );
  }

  protected renderButtons(): JSX.Element {
    return (
      <Grid container spacing={3}>
        <Grid item xs={2}></Grid>
        <Grid item xs={4}>
          <Button
            className="absence-form-buttons"
            variant="outlined"
            color="secondary"
            onClick={() => this.props.history.push("/home")}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item xs={4}>
          {this.props.editMode() ? (
            <ButtonWithLoader
              stylingClass="absence-form-buttons"
              buttonAction={this.editAbsence}
              loading={this.state.loadingButton}
              buttonText="Save"
            />
          ) : (
            <ButtonWithLoader
              dataUnitTest="add-absence-button"
              stylingClass="absence-form-buttons"
              buttonAction={this.addAbsence}
              loading={this.state.loadingButton}
              buttonText="Add"
            />
          )}
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    );
  }

  protected getAbsenceType(): AbsencesEnum {
    const absences = Object.values(AbsencesEnum);
    return absences.filter((el) => StringUtil.zipString(el) === this.props.match.params.type)[0];
  }

  protected areInputsValid(): boolean {
    return true;
  }

  protected addAbsence = async (): Promise<void> => {
    if (!this.areInputsValid()) return;
    this.setState({
      loadingButton: true,
    });
    try {
      await this.AbsenceService.addAbsence(
        this.getAbsenceType(),
        this.props.startingDate,
        this.props.endingDate,
        this.state.comment.value,
      );
      this.props.history.push({ pathname: "/home", state: { showSnackbar: true } });
    } catch (error) {
      if (error.message === errMessage) {
        this.props.setError(error.message);
      } else {
        this.setState({
          warning: error.message,
          loadingButton: false,
        });
      }
    }
  };

  protected editAbsence = async (): Promise<void> => {
    if (!this.areInputsValid()) return;
    try {
      this.setState({
        loadingButton: true,
      });
      const absenceId = this.props.match.params.id;

      await this.AbsenceService.editAbsence(
        absenceId,
        this.getAbsenceType(),
        this.props.startingDate,
        this.props.endingDate,
        this.state.comment.value,
      );
      this.props.history.push({ pathname: "/home", state: { showSnackbar: true } });
    } catch (error) {
      if (error.message === errMessage) {
        this.props.setError(error.message);
      } else {
        this.setState({
          warning: error.message,
          loadingButton: false,
        });
      }
    }
  };

  protected abstract isEndDateCalculable(): boolean;

  abstract render(): JSX.Element;
}

class AbsenceWithCalculatedEndDate extends AbsenceForm {
  async componentDidMount(): Promise<void> {
    if (!this.props.editMode()) {
      this.setState({
        loadingOnMount: true,
      });
      await this.props.setStartingDate(
        new Date(),
        DateUtil.todayStringified(),
        this.isEndDateCalculable(),
        this.getAbsenceType(),
      );
      this.setState({
        loadingOnMount: false,
      });
    }
  }
  protected isEndDateCalculable(): boolean {
    return true;
  }

  render(): JSX.Element {
    if (this.state.loadingOnMount) {
      return <CircularProgress />;
    }
    return (
      <>
        {this.renderDateInputs(true)}
        {this.renderWarning()}
        {this.renderButtons()}
      </>
    );
  }
}

abstract class AbsenceWithNonCalculatedEndDate extends AbsenceForm {
  render(): JSX.Element {
    return <>{this.renderDateInputs(false)}</>;
  }

  protected isEndDateCalculable(): boolean {
    return false;
  }

  areInputsValid(): boolean {
    if (this.props.startingDate > this.props.endingDate) {
      this.setState({
        warning: "Starting date must not be after ending date",
      });
      return false;
    }
    return true;
  }
}

export class PaidAndUnpaid extends AbsenceWithNonCalculatedEndDate {
  renderCommentInput(): JSX.Element {
    return (
      <>
        <Grid item xs={12}>
          <TextField
            className="absence-form-text-fields card-content"
            data-unit-test="comment-input"
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
      </>
    );
  }

  render(): JSX.Element {
    if (this.state.loadingOnMount) {
      return <CircularProgress />;
    }

    return (
      <>
        {super.render()}
        {this.renderCommentInput()}
        {this.renderWarning()}
        {this.renderButtons()}
      </>
    );
  }

  areInputsValid(): boolean {
    if (!super.areInputsValid()) {
      return false;
    }
    if (!this.state.comment.isValid) {
      this.setState({
        comment: { ...this.state.comment, textBoxInvalid: true },
        warning: this.state.comment.errorText,
      });
      return false;
    } else {
      this.setState({
        comment: { ...this.state.comment, textBoxInvalid: false },
      });
    }
    return true;
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
}

export class Court extends AbsenceWithNonCalculatedEndDate {
  render(): JSX.Element {
    if (this.state.loadingOnMount) {
      return <CircularProgress />;
    }
    return (
      <>
        {super.render()}
        {this.renderWarning()}
        {this.renderButtons()}
      </>
    );
  }
}
