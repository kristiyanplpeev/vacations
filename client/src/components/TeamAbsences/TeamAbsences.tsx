import React, { Component } from "react";

import Grid from "@mui/material/Grid";

import { AbsencesViewEnum } from "common/constants";
import Absences from "components/Absences/Absences";

class TeamAbsences extends Component {
  render(): JSX.Element {
    return (
      <Grid>
        <h1 className="homepage-header">Team Absences</h1>
        <Absences absences={AbsencesViewEnum.team} />
      </Grid>
    );
  }
}

export default TeamAbsences;
