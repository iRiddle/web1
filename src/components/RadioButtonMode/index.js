import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel
} from "@material-ui/core";

const styles = theme => ({
  root: {
    padding: "1rem",
    paddingTop: "0",
    color: "#6F5091",
    "&$checked": {
      color: "#6F5091"
    }
  },
  labelStatic: {
    marginTop: "1.5rem"
  },
  formControl: {
    marginTop: 0
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  subTitle: {
    color: "#9B9B9B"
  }
});

class RadioButtonMode extends React.Component {

  state = {
    selectedPersona: null
  };

  onHandleChange = event => {
    const { id, handleChange } = this.props;
    handleChange(id, event.target.value);
    this.setState({
      selectedPersona: event.target.value
    });
  };

  getRadioButtons = options => {
    let buttons = options.map((option, idx) => {
      return (
        <FormControlLabel
          id={option.Id}
          key={option.Id}
          value={option.value}
          control={<Radio />}
          label={option.label}
          style={{ marginRight: "40px" }}
        />
      );
    });
    return buttons;
  };

  /**
   * @returns <jsx> return mode based <TextField /> or <Typography /> item
   */
  getModeBasedField = () => {
    const { mode, label, value, options, classes, selectedPersona } = this.props;
    if (mode === "view") {

      return (
        <div>
          {/* <Typography
            variant="subtitle2"
            gutterBottom
            className={classes.subTitle}
          >
            {accessibleFeature}
          </Typography> */}

          <Typography
            className={classes.labelStatic}
            variant="subtitle1"
            gutterBottom
          >
            {this.state.selectedPersona || selectedPersona}
          </Typography>
        </div>
      );
    } else {
      const radioButtons = this.getRadioButtons(options);
      return (
        <div>
          <Typography
            variant="subtitle2"
            gutterBottom
            className={classes.subTitle}
          >
            {label}
          </Typography>
          <FormControl component="fieldset" className={classes.formControl}>
            <RadioGroup
              className={classes.group}
              value={value}
              onChange={this.onHandleChange}
              classes={{
                checked: classes.checked
              }}
            >
              {radioButtons}
            </RadioGroup>
          </FormControl>
        </div>
      );
    }
  };

  render() {
    const { width, classes } = this.props;
    const style = { width };
    return (
      <div style={style} className={classes.root}>
        {this.getModeBasedField()}
      </div>
    );
  }
}

RadioButtonMode.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RadioButtonMode);
