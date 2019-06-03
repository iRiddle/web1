import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import PhoneNo from "../PhoneNo";
import { Link } from "@material-ui/core";

const DeactivateLink = () => (
  <a
    href="https://driscolls.oktapreview.com/api/v1/users/00ukm3ceky6lbIXFm0h7/lifecycle/deactivate"
  >
    Deactivate User
  </a>
);

export default class PersonalInformation extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.currentEditUser.primaryPhone !==
        nextProps.currentEditUser.primaryPhone ||
      this.props.currentEditUser.secondaryPhone !==
        nextProps.currentEditUser.secondaryPhone ||
      this.props.currentEditUser.preferredLanguage !==
        nextProps.currentEditUser.preferredLanguage
    ) {
      return true;
    }
    return false;
  }
  render() {
    const {
      classes,
      currentEditUser,
      handleNumberChange,
      handleLanguageChange,
      handleNumberSecondaryChange,
      mode,
      userStatus
    } = this.props;
    return (
      <div className={classes.edit_popup__personal_information}>
        <Grid container spacing={24}>
          <Grid item xl={1} lg={1} md={1}>
            <Typography
              variant="subtitle2"
              style={{ color: "black", fontWeight: "bold" }}
            >
              Personal Information
            </Typography>
          </Grid>
          <Grid item xl={3} lg={3} md={3}>
            <div className={classes.edit_popup__infoContainer_data}>
              <PhoneNo
                value={currentEditUser.primaryPhone}
                handleChange={handleNumberChange}
                id={currentEditUser.id}
                mode={mode}
                label="Primary Phone"
              />
              <PhoneNo
                value={currentEditUser.secondaryPhone}
                handleChange={handleNumberSecondaryChange}
                id={currentEditUser.id}
                mode={mode}
                label="Secondary Phone"
              />
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Preffered language</FormLabel>
                <RadioGroup
                  aria-label="Gender"
                  name="gender1"
                  className={classes.edit_popup__gropuLanguage}
                  value={currentEditUser.preferredLanguage}
                  onChange={handleLanguageChange}
                >
                  <FormControlLabel
                    value="en"
                    control={<Radio />}
                    label="English"
                  />
                  <FormControlLabel
                    value="esp"
                    control={<Radio />}
                    label="Spanish"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </Grid>
          <Grid item xl={3} lg={3} md={3}>
            <div className={classes.edit_popup__infoContainer_data}>
              <TextField
                disabled
                id="standard-disabled"
                label="FIRST NAME"
                defaultValue={currentEditUser.firstName}
                className={classes.edit_popup__textEdit}
                margin="normal"
                InputProps={{
                  disableUnderline: true
                }}
              />
              <TextField
                disabled
                id="standard-disabled"
                label="LAST NAME"
                defaultValue={currentEditUser.lastName}
                className={classes.edit_popup__textEdit}
                margin="normal"
                InputProps={{
                  disableUnderline: true
                }}
              />
              <TextField
                disabled
                id="standard-disabled"
                label="EMAIl"
                defaultValue={currentEditUser.email}
                className={classes.edit_popup__textEdit}
                margin="normal"
                InputProps={{
                  disableUnderline: true
                }}
              />
              <TextField
                disabled
                id="standard-disabled"
                label="COUNTRY"
                defaultValue={currentEditUser.country}
                className={classes.edit_popup__textEdit}
                margin="normal"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
          </Grid>
          <Grid item xl={3} lg={3} md={3}>
            <div className={classes.edit_popup__infoContainer_data}>
              <TextField
                disabled
                id="standard-disabled"
                label="STATUS"
                defaultValue={userStatus}
                className={classes.edit_popup__textEdit}
                margin="normal"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
          </Grid>
          <Grid item xl={2} lg={2} md={2}>
            <Typography
              variant="subtitle2"
              style={{ color: "black", fontWeight: "bold" }}
            >
              {/* Deactivate User */}
              <Link component={DeactivateLink} className={classes.linkFont} />
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}
