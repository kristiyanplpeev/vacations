import React, { Component } from "react";

import { Button, Divider } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
import "./Homepage.css";
import { RouteComponentProps, StaticContext } from "react-router";

import { AbsencesEnum, leaveTypesWithURLs } from "common/constants";
import Absences from "components/Absences/Absences";
import Error from "components/common/Error/Error";

interface HomepageProps extends RouteComponentProps<null, StaticContext, { showSnackbar: boolean }> {}

interface HomepageState {
  loading: boolean;
  error: string;
  successMessage: boolean;
  openSelectorDialog: boolean;
}

class Homepage extends Component<HomepageProps, HomepageState> {
  constructor(props: HomepageProps) {
    super(props);
    this.state = {
      loading: false,
      error: "",
      successMessage: false,
      openSelectorDialog: false,
    };
  }

  render(): JSX.Element {
    const { error } = this.state;
    if (error) {
      return <Error message={error} />;
    }

    return (
      <div className="homepage-root">
        <h1 className="homepage-header">My Absences</h1>
        <Absences handleToggleSelectDialog={this.handleToggleSelectDialog} isShowingTeamAbsences={false} />
        {this.renderSnackbar()}
        {this.renderSelectDialog()}
      </div>
    );
  }

  renderSelectDialog(): JSX.Element {
    return (
      <Dialog onClose={() => this.handleToggleSelectDialog(false)} open={this.state.openSelectorDialog}>
        <DialogTitle>Specify the type of leave you want to request?</DialogTitle>
        <Divider className="homepage-main-divider" />
        <List>
          {Object.values(AbsencesEnum).map((el) => {
            const absenceUrl = Object.values(leaveTypesWithURLs).find((absence) => absence.leave === el);
            if (!absenceUrl) {
              this.setState({
                error: `Type ${el} is not supported`,
              });
              return;
            }
            return (
              <>
                <ListItem button key={el} onClick={() => this.props.history.push(`/new/${absenceUrl.url}`)}>
                  <ListItemText primary={el} />
                </ListItem>
                <Divider />
              </>
            );
          })}
        </List>
      </Dialog>
    );
  }

  renderSnackbar(): JSX.Element {
    return (
      <Snackbar open={this.state.successMessage} onClose={() => this.openSnackbar(false)} autoHideDuration={2000}>
        <Alert severity="success">Your absence has been successfully submitted!</Alert>
      </Snackbar>
    );
  }

  handleToggleSelectDialog = (state: boolean): void => {
    this.setState({
      openSelectorDialog: state,
    });
  };

  openSnackbar(isOpen: boolean): void {
    if (this.props.location.state?.showSnackbar && isOpen) {
      this.setState({
        successMessage: true,
      });
      this.props.history.replace("/home");
    } else if (!isOpen) {
      this.setState({
        successMessage: false,
      });
    }
  }
}

export default Homepage;
