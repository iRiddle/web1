import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper
} from "@material-ui/core";

const styles = theme => ({
  root: {
    display: "flex",
    zIndex: 2,
    position: "fixed",
    height: "30%",
    overflow: "scroll",
    marginLeft: "36.5%",
    marginTop: "3.5rem"
  },
  formControl: {
    margin: theme.spacing.unit * 3
  }
});

class CheckboxList extends React.Component {
  handleChange = (id, isChecked) => {
    this.props.filterColumns(id, !isChecked);
  };

  render() {
    const { classes, title, checkboxItems } = this.props;

    return (
      <Paper className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel>{title}</FormLabel>
          <FormGroup>
            {checkboxItems.map(item => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.isChecked}
                    onChange={() => this.handleChange(item.id, item.isChecked)}
                    value={item.label}
                  />
                }
                label={item.label}
                key={item.id}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Paper>
    );
  }
}

CheckboxList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CheckboxList);
