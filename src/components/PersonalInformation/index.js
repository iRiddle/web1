import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Divider, TextField } from "@material-ui/core";
import Form from "react-validation/build/form";

import InputMode from "../InputMode";
import SelectMode from "../SelectMode";
import RadioButtonMode from "../RadioButtonMode";
import PhoneNo from "../PhoneNo";
import {
  required,
  email,
  driscollsEmail,
  nonDriscollsEmail,
  maxlen
} from "../../utils/validations";

// const languageMap = JSON.parse(localStorage.getItem("languageMap"));languageMap
const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: "2rem 0 1rem 0"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  divider: {
    marginTop: "1.5rem"
  }
});

class PersonalInformation extends React.Component {
  state = {
    labelWidth: 0,
    selectedCountry: ""
  };

  handleSelectChange = (id, value) => {
    const { handlePersonalInformationInput } = this.props;
    handlePersonalInformationInput(id, value);
  };

  renderForm = () => {
    const {
      inputDetails,
      selectedPersona,
      userData,
      mode,
      languageMap
    } = this.props;
    const { fields } = this.props;
    let formFields = fields.map(field => {
      let personalInformation = inputDetails;
      if (mode === "register" && field.mode === "view") {
        personalInformation = userData;
      }
      if (field.type === "input") {
        const customValidations =
          field.label === "email"
            ? selectedPersona &&
              (selectedPersona.value === "Ranch Planner" ||
                selectedPersona.value === "Ranch Admin" ||
                selectedPersona === "Ranch Planner" ||
                selectedPersona === "Ranch Admin")
              ? [required, email]
              : [required, email, driscollsEmail]
            : field.validations;
        return (
          <InputMode
            key={field.label}
            id={field.label}
            mode={field.mode}
            label={languageMap[field.label]}
            value={personalInformation[field.label]}
            handleChange={this.handleSelectChange}
            width={field.width}
            validations={customValidations}
            selectedPersona={selectedPersona}
          />
        );
      } else if (field.type === "radio") {
        return (
          <RadioButtonMode
            key={field.label}
            id={field.label}
            mode={field.mode}
            label={languageMap[field.label]}
            value={personalInformation[field.label] || "English"}
            options={field.options}
            handleChange={this.handleSelectChange}
          />
        );
      } else if (field.type === "phoneNo") {
        return (
          <PhoneNo
            key={field.label}
            id={field.label}
            value={userData[field.label]}
            label={languageMap[field.label]}
            width={field.width}
            handleChange={this.handleSelectChange}
          />
        );
      } else {
        return (
          <SelectMode
            key={field.label}
            id={field.label}
            mode={field.mode}
            label={languageMap[field.label]}
            value={
              personalInformation[field.label] &&
              personalInformation[field.label].value
            }
            options={field.options}
            handleChange={this.handleSelectChange}
            width={field.width}
            placeholder={field.placeholder}
          />
        );
      }
    });
    return formFields;
  };

  render() {
    const { classes, languageMap } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={3} className={classes.rowTitle}>
            <Typography variant="subtitle1" gutterBottom>
              {languageMap.personalInformation}
            </Typography>
          </Grid>

          <Grid item xs={9}>
            <Form className={classes.container} autoComplete="off">
              {this.renderForm()}
            </Form>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
      </div>
    );
  }
}

PersonalInformation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PersonalInformation);
