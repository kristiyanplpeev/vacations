import React, { Component } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import "./DeleteAbsenceModal.css";

interface DeleteAbsenceModalState {}

interface DeleteAbsenceModalProps {
  deleteAbsenceId: string;
  handleCancelClick: () => void;
  handleConfirmClick: (currentAbsenceId: string) => Promise<void>;
}

class DeleteAbsenceModal extends Component<DeleteAbsenceModalProps, DeleteAbsenceModalState> {
  constructor(props: DeleteAbsenceModalProps) {
    super(props);
    this.state = {};
  }

  render(): JSX.Element {
    return (
      <Modal open={!!this.props.deleteAbsenceId}>
        <Box className="confirmation-modal">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Do you want to delete selected absence?
          </Typography>
          <Button
            variant="outlined"
            className="modal-buttons"
            onClick={() => this.props.handleConfirmClick(this.props.deleteAbsenceId)}
          >
            Confirm
          </Button>
          <Button variant="outlined" color="error" className="modal-buttons" onClick={this.props.handleCancelClick}>
            Cancel
          </Button>
        </Box>
      </Modal>
    );
  }
}

export default DeleteAbsenceModal;
