import React, { Component } from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import "./Positions.css";
import { resolve } from "inversify-react";

import { IPositions } from "common/interfaces";
import Error from "components/common/Error/Error";
import { IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";

interface IExpandedInput {
  value: number;
  isValid: boolean;
  validate: (value: number) => boolean;
}

interface PositionsState {
  error: string;
  loading: boolean;
  positions: Array<IPositions>;
  expandedPosition: string;
  expandedInput: IExpandedInput;
  openModal: boolean;
}

interface PositionsProps {}

class Positions extends Component<PositionsProps, PositionsState> {
  @resolve(TYPES.user) private userService!: IUserService;

  constructor(props: PositionsProps) {
    super(props);
    this.state = {
      error: "",
      loading: false,
      positions: [],
      expandedPosition: "",
      expandedInput: {
        value: 0,
        isValid: true,
        validate: (value: number) => value >= 0.1 && value <= 1,
      },
      openModal: false,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      this.setState({
        loading: true,
      });

      const positions = await this.userService.getPositions();

      this.setState({
        positions,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  }

  render(): JSX.Element {
    if (this.state.error) {
      return <Error message={this.state.error} />;
    }
    return (
      <div className="positions-container">
        <Typography className="positions-title" variant="h4">
          Positions
        </Typography>
        {this.renderPositions()}
        {this.renderModal()}
      </div>
    );
  }

  renderPositions(): JSX.Element {
    if (this.state.loading) {
      return <CircularProgress />;
    }
    const { isValid } = this.state.expandedInput;
    return (
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {this.getSortedPositions().map((position) => (
          <div key={position.id}>
            <ListItemButton onClick={() => this.handleExpand(position.id)}>
              <ListItemText primary={`${position.position}`} secondary={`Coefficient: ${position.coefficient}`} />
              {this.state.expandedPosition === position.id ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={this.state.expandedPosition === position.id} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className="positions-expand-container">
                <TextField
                  error={!isValid}
                  label="Change coefficient"
                  helperText={!isValid && "Coefficient must be between 0.1 and 1"}
                  defaultValue={position.coefficient}
                  variant="standard"
                  onChange={this.handleEditCoefficientChange}
                />
                <Button
                  onClick={() => this.handleEditCoefficientClick()}
                  className="change-position-button"
                  color="error"
                >
                  change
                </Button>
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    );
  }

  renderModal(): JSX.Element {
    const updatedPosition = this.state.positions.find((position) => position.id === this.state.expandedPosition);

    return (
      <Modal open={this.state.openModal}>
        <Box className="position-confirmation-modal">
          <Typography id="modal-modal-title" variant="h6">
            {`Do u want to update ${updatedPosition?.position} coefficient to ${this.state.expandedInput.value}?`}
          </Typography>
          <Button variant="outlined" className="modal-buttons" onClick={this.handleConfirmClick}>
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="error"
            className="change-position-modal-buttons"
            onClick={this.handleModalClose}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    );
  }

  handleEditCoefficientChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = +event.target.value;
    const { expandedInput } = this.state;

    this.setState({
      expandedInput: {
        ...expandedInput,
        value: inputValue,
        isValid: expandedInput.validate(inputValue),
      },
    });
  };

  handleConfirmClick = async (): Promise<void> => {
    try {
      this.setState({
        loading: true,
      });
      await this.userService.updatePositionCoefficient(this.state.expandedPosition, +this.state.expandedInput.value);
      const updatedPositions = this.state.positions.map((position) => {
        if (this.state.expandedPosition === position.id) {
          position.coefficient = +this.state.expandedInput.value;
        }
        return position;
      });
      this.setState({
        positions: updatedPositions,
        expandedPosition: "",
        openModal: false,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }
  };

  handleEditCoefficientClick(): void {
    const { expandedInput } = this.state;
    if (expandedInput.isValid) {
      this.setState({
        openModal: true,
      });
    }
  }

  handleExpand(positionId: string): void {
    const expandedPositionDetails = this.state.positions.find((position) => position.id === positionId);
    const { expandedInput } = this.state;

    if (!expandedPositionDetails) {
      this.setState({
        error: "Position is invalid",
      });
      return;
    }
    this.setState({
      expandedPosition: this.state.expandedPosition !== positionId ? positionId : "",
      expandedInput: {
        ...expandedInput,
        value: +expandedPositionDetails.coefficient,
        isValid: expandedInput.validate(+expandedPositionDetails.coefficient),
      },
    });
  }

  handleModalClose = (): void => {
    this.setState({
      openModal: false,
    });
  };

  getSortedPositions(): Array<IPositions> {
    return [...this.state.positions].sort((a, b) => {
      if (a.sortOrder < b.sortOrder) return -1;
      if (a.sortOrder > b.sortOrder) return 1;
      return 0;
    });
  }
}

export default Positions;
