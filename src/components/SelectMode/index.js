import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import SingleSelect from "../SingleSelect";

const styles = theme => ({
  root: {
    padding: "1rem",
    paddingTop: "0"
  },
  select: {
    width: "100%",
    marginTop: "0.5rem"
  },
  labelStatic: {
    marginTop: "1.5rem"
  },
  subTitle: {
    color: "#9B9B9B"
  }
});

class SelectMode extends React.Component {
  onChange = value => {
    const { id, handleChange } = this.props;
    handleChange(id, value);
  };

  /**
   * @returns <jsx> return mode based <ReactSelect /> or <Typography /> item
   */
  getModeBasedField = () => {
    const { mode, label, value, options, classes, placeholder } = this.props;
    if (mode === "view") {
      return (
        <div>
          <Typography
            variant="subtitle2"
            gutterBottom
            className={classes.subTitle}
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
          {label && (
            <Typography
              variant="subtitle2"
              gutterBottom
              className={classes.subTitle}
            >
              {label}
            </Typography>
          )}
          <SingleSelect
            placeholder={placeholder}
            options={options}
            onChange={this.onChange}
            container={classes.select}
            mode={mode}
          />
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

SelectMode.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SelectMode);
