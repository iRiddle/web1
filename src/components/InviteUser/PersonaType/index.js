import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Divider } from "@material-ui/core";

import SelectMode from "../../SelectMode";
import RadioButtonMode from "../../RadioButtonMode";

const styles = theme => ({
  root: {},
  personaTypecontainer: {
    marginTop: "1rem",
    marginBottom: "0.5rem"
  },
  label: {
    paddingTop: "1.5rem"
  }
});

// const languageMap = JSON.parse(localStorage.getItem("languageMap"));

class PersonaType extends React.Component {
  componentDidMount() {
    /**
     * * selects the persona type by default if persona types array has one element.
     */
    const { personaTypes, handlePersonaChange } = this.props;
    if (personaTypes.length === 1) {
      handlePersonaChange(personaTypes[0]);
    }
  }

  /**
   * * Receives updated persona value from <SelectMode /> component and passes to <InviteUsers/> scene
   */

  updatePersonaChange = (field, persona) => {
    const { handlePersonaChange } = this.props;
    handlePersonaChange(persona);
  };

  render() {
    const { classes, mode, selectedPersona, personaTypes, accessibleFeatures, languageMap } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={24} className={classes.personaTypecontainer}>
          <Grid item xs={3}>
            <Typography variant="subtitle1" className={classes.label}>
              {languageMap.personaType}
            </Typography>
          </Grid>
          <Grid item xs={9}>
            {/* <SelectMode
              mode={mode}
              value={selectedPersona && selectedPersona.value}
              options={personaTypes}
              width={"25%"}
              placeholder={"Select Persona"}
              handleChange={this.updatePersonaChange}
            /> */}
            <RadioButtonMode
              accessibleFeature={accessibleFeatures}
              selectedPersona={selectedPersona && selectedPersona.value}
              mode={mode}
              options={personaTypes}
              handleChange={this.updatePersonaChange}
            />
          </Grid>
        </Grid>
        <Divider />
      </div>
    );
  }
}

PersonaType.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PersonaType);
