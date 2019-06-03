import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from "@material-ui/core";

class DialogBox extends React.Component {
  render() {
    const {
      open,
      handleClose,
      modalTitle,
      modalMessage,
      onClickYes,
      onClickNo
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{modalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {modalMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickYes} color="secondary">
            Yes
          </Button>
          <Button onClick={onClickNo} color="secondary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default DialogBox;
