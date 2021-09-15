import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

interface ButtonWithLoaderProps {
  dataUnitTest?: string;
  stylingClass: string;
  loading: boolean;
  buttonText: string;
  buttonAction: () => void;
}

class ButtonWithLoader extends Component<ButtonWithLoaderProps> {
  constructor(props: ButtonWithLoaderProps) {
    super(props);
  }
  render(): JSX.Element {
    return (
      <Button
        data-unit-test={this.props.dataUnitTest || null}
        className={this.props.stylingClass}
        disabled={this.props.loading}
        color="primary"
        variant="outlined"
        onClick={this.props.buttonAction}
      >
        {this.props.loading ? <CircularProgress color="inherit" size={24} /> : this.props.buttonText}
      </Button>
    );
  }
}

export default ButtonWithLoader;
