import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import ReactPhoneInput from "react-phone-input-2";
const styles = theme => ({
  root: {
    margin: "0 1rem 2rem 0rem"
  },
  phoneNo: {
    width: "100%",
    height: "3rem"
  },
  subtitle: {
    marginBottom: "0.5rem",
    color: "#9B9B9B"
  }
});

class PhoneNo extends React.Component {
  state = { value: "" };

  componentDidMount() {
    this.setState({
      value: this.props.value
    });
  }
  onChange = value => {
    const { id, handleChange } = this.props;
    this.setState({ value }, () => handleChange(id, value));
  };

  render() {
    const { width, classes, label } = this.props;
    const { value } = this.state;
    const style = { width };
    return (
      <div style={style} className={classes.root}>
        <Typography
          variant="subtitle2"
          gutterBottom
          className={classes.subtitle}
        >
          {label}
        </Typography>

        <ReactPhoneInput
          defaultCountry={"us"}
          containerStyle={{ height: "3.4rem" }}
          inputStyle={{ height: "3.4rem", width: "90s%" }}
          onChange={this.onChange}
          value={value}
          disableAreaCodes
          preferredCountries={["us", "mx", "cl"]}
        />
      </div>
    );
  }
}

PhoneNo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PhoneNo);
