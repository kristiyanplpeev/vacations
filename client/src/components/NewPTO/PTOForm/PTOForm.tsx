import React, { Component } from "react";

import DateFnsUtils from "@date-io/date-fns";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Alert } from "@material-ui/lab";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { resolve } from "inversify-react";
import { RouteComponentProps, StaticContext, withRouter } from "react-router";

import { AbsencesEnum, errMessage } from "common/constants";
import { IPTO, ITextBox, OptionalWithNull } from "common/interfaces";
import "./PTOForm.css";
import { StringUtil } from "common/StringUtil";
import ButtonWithLoader from "components/common/ButtonWithLoader/ButtonWithLoader";
import { IPTOService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

export interface PTOFormMatchProps {
  id: string;
  type: string;
}
interface PTOFormState {
  comment: ITextBox;
  warning: string;
  loading: boolean;
  loadingEditMode: boolean;
}

interface PTOFormProps extends RouteComponentProps<PTOFormMatchProps, StaticContext, { showSnackbar: boolean }> {
  startingDate: string;
  endingDate: string;
  setStartingDate: (date: Date | null, value: OptionalWithNull<string>) => Promise<void>;
  setEndingDate: (date: Date | null, value: OptionalWithNull<string>) => Promise<void>;
  setError: (errorMessage: string) => void;
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
      comment: {
        value: "Out of office",
        isValid: true,
        validate: (value) => value.length >= 1 && value.length <= 1000,
        errorText: "Comment is mandatory.",
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
        this.props.setStartingDate(new Date(PTODetailed.from_date), PTODetailed.from_date);
        this.props.setEndingDate(new Date(PTODetailed.to_date), PTODetailed.to_date);
        this.setState({
          comment: { ...this.state.comment, value: PTODetailed.comment },
        });
      } catch (error) {
        this.props.setError(error.message);
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
              {this.renderCommentInput()}
              {this.renderWarning()}
              {this.renderButtons()}
            </CardContent>
          </Card>
        </Grid>
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
            disabled={
              this.props.match.params.type === StringUtil.zipString(AbsencesEnum.weddingLeave) ||
              this.props.match.params.type === StringUtil.zipString(AbsencesEnum.bereavementLeave) ||
              this.props.match.params.type === StringUtil.zipString(AbsencesEnum.bloodDonationLeave)
                ? true
                : false
            }
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

  renderCommentInput(): JSX.Element {
    if (
      this.props.match.params.type !== StringUtil.zipString(AbsencesEnum.paidLeave) &&
      this.props.match.params.type !== StringUtil.zipString(AbsencesEnum.unpaidLeave)
    )
      return <></>;
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
      </>
    );
  }

  renderWarning(): JSX.Element {
    return (
      <Grid item xs={12}>
        {this.state.warning && (
          <Alert className="pto-form-warning card-content" data-unit-test="warning-message" severity="error">
            {this.state.warning}
          </Alert>
        )}
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
            color="secondary"
            onClick={() => this.props.history.push("/home")}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item xs={4}>
          {this.props.editMode() ? (
            <ButtonWithLoader
              stylingClass="pto-form-buttons"
              buttonAction={this.editPTO}
              loading={this.state.loading}
              buttonText="Save"
            />
          ) : (
            <ButtonWithLoader
              dataUnitTest="addPTO-button"
              stylingClass="pto-form-buttons"
              buttonAction={this.addPTO}
              loading={this.state.loading}
              buttonText="Add"
            />
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
      await this.PTOService.addPTO(PTODetails);
      this.props.history.push({ pathname: "/home", state: { showSnackbar: true } });
    } catch (error) {
      if (error.message === errMessage) {
        this.props.setError(error.message);
      } else {
        this.setState({
          warning: error.message,
          loading: false,
        });
      }
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
        this.props.setError(error.message);
      } else {
        this.setState({
          warning: error.message,
          loading: false,
        });
      }
    }
  };

  private getHoliday(): IPTO {
    return {
      startingDate: this.props.startingDate,
      endingDate: this.props.endingDate,
      comment: this.state.comment.value,
    };
  }

  areInputsValid = (): boolean => {
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
    if (this.props.startingDate > this.props.endingDate) {
      this.setState({
        warning: "Starting date must not be after ending date",
      });
      return false;
    }
    return true;
  };

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

export default withRouter(PTOForm);
