import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { CustomInput } from "../CustomForm";

const styles = theme => ({
  root: {
    padding: "1rem",
    paddingTop: "0"
  },
  textField: {
    width: "100%",
    marginTop: "0.5rem"
  },
  labelStatic: {
    marginTop: "1.5rem"
  },
  subtitle: {
    color: "#9B9B9B"
  }
});

class InputMode extends React.Component {
  handleInputChange = event => {
    const { id, handleChange } = this.props;
    handleChange(id, event.target.value);
  };

  /**
   * @returns <jsx> return mode based <TextField /> or <Typography /> item
   */
  getModeBasedField = () => {
    const { mode, label, value, classes, validations } = this.props;

    if (mode === "view") {
      return (
        <div>
          <Typography
            variant="subtitle2"
            className={classes.subtitle}
            gutterBottom
          >
            {label}
          </Typography>
          <Typography
            className={classes.labelStatic}
            variant="subtitle1"
            gutterBottom
          >
            {value}
          </Typography>
        </div>
      );
    } else {
      return (
        <div>
          <Typography
            variant="subtitle2"
            className={classes.subtitle}
            gutterBottom
          >
            {label}
          </Typography>
          <CustomInput
            required
            id="outlined-required"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            onChange={this.handleInputChange}
            value={value}
            validations={validations}
          />
        </div>
      );
    }
  };

  render() {
    const { mode, width, classes } = this.props;
    const style = mode === "view" ? { width: "25%" } : { width };
    return (
      <div style={style} className={classes.root}>
        {this.getModeBasedField()}
      </div>
    );
  }
}

InputMode.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputMode);
