import React, { Component, ReactNode } from "react";

import { KeyboardDatePicker } from "@material-ui/pickers";

interface NewPTOProps {}

interface NewPTOState {
  startingDate: string;
  endingDate: string;
}

class NewPTO extends Component<NewPTOProps, NewPTOState> {
  render(): ReactNode {
    return (
      <div>
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date picker dialog"
          format="MM/dd/yyyy"
          value={selectedDate}
          onChange={this.handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date picker dialog"
          format="MM/dd/yyyy"
          value={selectedDate}
          onChange={this.handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </div>
    );
  }

  handleDateChange = () => {
    console.log(":)");
  };
}

export default NewPTO;
