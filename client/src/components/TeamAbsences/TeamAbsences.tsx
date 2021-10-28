import React, { Component } from "react";

import Grid from "@mui/material/Grid";

import Absences from "components/Absences/Absences";

class TeamAbsences extends Component {
  render(): JSX.Element {
    return (
      <Grid>
        <h1 className="homepage-header">Team Absences</h1>
        <Absences isShowingTeamAbsences={true} />
      </Grid>
    );
  }
}

export default TeamAbsences;
