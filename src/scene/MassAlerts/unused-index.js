import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles, Button, Typography, IconButton } from "@material-ui/core";
import { capitalize } from "lodash";
import validator from "validator";
import { loadCSS } from "fg-loadcss/src/loadCSS";

//import ACTIONS
import {
  getDistrictAndBerryList,
  getDistrictAndCompanyList,
  getCompanyAndRanchList
} from "../../services/actions/persona.action";
import {
  sendActivationMail,
  assignUserToApp,
  inviteUser,
  findUserInMule,
  getInvitedUserDetails
} from "../../services/actions/user.action";
import { setPreferredLanguage } from "../../services/actions/language.action";

//import components
import PersonaType from "../../components/InviteUser/PersonaType";
import PersonalInformation from "../../components/PersonalInformation";
import AssignmentGeneric from "../../components/AssignmentGeneric";
import DialogBox from "../../components/DialogBox";
import WelcomeLetter from "../../components/InviteUser/WelcomeLetter";
import Notification from "../../components/Notification";

//import other files
import personaMap from "../../login/config/persona";
import { jobTitles, language } from "../../login/config/index";
import { required, alphaNumeric, maxlen } from "../../utils/validations";

import English from "../../login/config/language/english";
import Spanish from "../../login/config/language/spanish";
import SelectMode from "../../components/SelectMode";
import { AddCircleTwoTone } from "@material-ui/icons";
import { Icon } from "@material-ui/core";

import Form from "react-validation/build/form";
import { CustomInput } from "../../components/CustomForm";
import { classNames } from "react-select";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing.unit,
    fontSize: "1rem"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginRight: "1rem"
  },
  viewLetter: {
    padding: "2rem 0",
    color: "#007AFF",
    cursor: "pointer"
  },
  buttonContainerSave: {
    padding: 0,
    display: "flex",
    justifyContent: "flex-end"
  },
  welcome: {
    display: "flex",
    justifyContent: "flex-end"
  },
  iconButton: {
    width: "4rem",
    height: "4rem",
    marginTop: "0.3rem"
  },
  textField: {
    width: "100%",
    marginTop: "0.5rem"
  },
  subtitle: {
    color: "#9B9B9B"
  }
});

// const languageMap = JSON.parse(localStorage.getItem("languageMap"));
const oktaBaseUrl = "https://driscolls.oktapreview.com/api/v1/users/";

class MassAlerts extends Component {
  state = {
    selectedPersona: null,
    userCreated: false,
    mode: "create",
    showDialog: false,
    showWelcomeLetter: false,
    showCreateUserNotification: false,
    showInvitationNotification: false,
    showErrorNotification: false,
    showExistingUserWarningDialog: false,
    errorMessage: null,
    assignments: [],
    isFormValidated: false,
    fields: [
      {
        label: "firstName",
        type: "input",
        mode: "edit",
        width: "25%",
        validations: [required, maxlen, alphaNumeric]
      },
      {
        label: "lastName",
        type: "input",
        mode: "edit",
        width: "25%",
        validations: [required, maxlen, alphaNumeric]
      },
      {
        label: "email",
        type: "input",
        mode: "edit",
        width: "35%"
      },
      {
        label: "country",
        type: "select",
        mode: "edit",
        options: this.props.countryList,
        placeholder: "Select Country",
        width: "25%"
      },
      {
        label: "preferredLanguage",
        type: "select",
        mode: "edit",
        options: language,
        placeholder: "Select Preferred Language",
        width: "25%"
      }
    ],
    personalInformation: {
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      preferredLanguage: "",
      jobTitle: ""
    },
    existingOktaUserDetails: null,
    isFieldEmpty: true,
    languageMap: English
  };

  componentDidMount() {
    loadCSS(
      "https://use.fontawesome.com/releases/v5.1.0/css/all.css",
      document.querySelector("#massAlertContent")
    );
    this.getLanguageMap();
    this.initNetworkCalls();
  }

  getLanguageMap() {
    const { userDetails, loggedInUser, setPreferredLanguage } = this.props;

    const preferredLanguage = localStorage.getItem("preferredLanguage");
    let languageMap = preferredLanguage === "esp" ? Spanish : English;

    if (userDetails) {
      setPreferredLanguage(
        { login: loggedInUser.email || loggedInUser.login },
        () => {}
      );
    }

    this.setState({ languageMap });
  }

  initNetworkCalls = () => {
    const { userDetails } = this.props;

    if (userDetails) {
      this.getAssignmentApi();
    }
  };

  /**
   * @returns assignmant api based on persona.
   */

  getAssignmentApi = () => {
    const {
      loggedInUser,
      getDistrictAndBerryList,
      getDistrictAndCompanyList,
      getCompanyAndRanchList,
      userDetails
    } = this.props;
    switch (userDetails.profile.persona) {
      case "Super Admin":
        return getDistrictAndBerryList({
          personaid: personaMap[userDetails.profile.persona],
          useroktaid: loggedInUser.sub || loggedInUser.userId
        });

      case "Regional Admin":
        return getDistrictAndCompanyList({
          personaid: personaMap[userDetails.profile.persona],
          useroktaid: loggedInUser.sub || loggedInUser.userId
        });

      case "Ranch Admin":
        return getCompanyAndRanchList({
          personaid: personaMap[userDetails.profile.persona],
          useroktaid: loggedInUser.sub || loggedInUser.userId
        });

      default:
        break;
    }
  };

  /**
   * * Updates the state with selected persona type from <PersonaType/>
   */
  handlePersonaChange = persona => {
    const { fields } = this.state;
    if (
      persona.value === "Ranch Admin" ||
      persona.value === "Ranch Planner" ||
      persona === "Ranch Admin" ||
      persona === "Ranch Planner"
    ) {
      const jobTitle = fields.find(field => field.label === "jobTitle");
      if (!jobTitle) {
        fields.splice(4, 0, {
          label: "jobTitle",
          type: "select",
          mode: "edit",
          options: jobTitles,
          placeholder: "Select Job Title",
          validations: [required],
          width: "25%"
        });
      }
    }
    this.setState({
      selectedPersona: persona || persona.value
    });
  };

  handlePersonalInformationInput = (id, value) => {
    const { personalInformation, selectedPersona } = this.state;
    personalInformation[id] = value;
    this.setState({
      personalInformation
    });

    let isFieldEmpty = false;

    // Object.keys(personalInformation).map(key => {
    //   if (key != "jobTitle" && !personalInformation[key]) {
    //     isFieldEmpty = true;
    //   }
    // });

    Object.keys(personalInformation).map(key => {
      if (
        selectedPersona.value === "Ranch Admin" ||
        selectedPersona.value === "Ranch Planner" ||
        selectedPersona === "Ranch Admin" ||
        selectedPersona === "Ranch Planner"
      ) {
        if (
          !personalInformation[key] ||
          !validator.isEmail(personalInformation["email"])
        ) {
          isFieldEmpty = true;
        }
      } else {
        if (
          (key != "jobTitle" && !personalInformation[key]) ||
          !Boolean(personalInformation["email"].match(/^.*@driscolls\.com/))
        ) {
          isFieldEmpty = true;
        }
      }
    });

    this.setState({ isFieldEmpty });
  };

  updateAssignment = assignments => {
    this.setState({ assignments });
  };

  /**
   * * Function to control Dialog Box.
   */
  handleDialogClose = () => {
    this.setState({
      showExistingUserWarningDialog: false
    });
  };

  handleDialogClickYes = () => {
    const { existingOktaUserDetails } = this.state;
    this.setState({
      personalInformation: existingOktaUserDetails,
      showExistingUserWarningDialog: false,
      userCreated: true
    });
    this.changePersonalInfoFieldsMode("view");
  };

  /**
   * * Controls welcomeletter modal.
   */
  toggleWelcomeLetter = () => {
    const { showWelcomeLetter } = this.state;
    this.setState({
      showWelcomeLetter: !showWelcomeLetter
    });
  };

  /**
   * * controls Notifications.
   */
  hideNotification = (notificationType, visible) => {
    if (notificationType === "create-user") {
      this.setState({
        showCreateUserNotification: visible
      });
    } else if (notificationType === "save-send") {
      this.setState({
        showInvitationNotification: visible
      });
    } else if (notificationType === "error") {
      this.setState({
        showErrorNotification: visible
      });
    }
  };

  /**
   * * Creates new user in OKTA.
   */
  handleCreateUser = () => {
    const { personalInformation, selectedPersona } = this.state;
    personalInformation.firstName = capitalize(personalInformation.firstName);
    personalInformation.lastName = capitalize(personalInformation.lastName);

    this.setState({
      personalInformation
    });
    const userData = {
      profile: {
        firstName: personalInformation.firstName,
        lastName: personalInformation.lastName,
        email: personalInformation.email,
        login: personalInformation.email,
        persona: selectedPersona.value || selectedPersona,
        country: personalInformation.country.value,
        jobTitle: personalInformation.jobTitle.value,
        preferredLanguage:
          personalInformation.preferredLanguage.value === "English"
            ? "en"
            : "esp"
      }
    };
    this.props.createOktaUser(userData, this.userCreated);
  };

  userCreated = err => {
    const { personalInformation } = this.state;
    if (err) {
      this.props.findUserInMule(
        { login: personalInformation.email },
        (findErr, userData) => {
          if (findErr || userData.isUserPresent) {
            this.setState({
              showErrorNotification: true,
              errorMessage: languageMap[err],
              personalInformation: {
                firstName: "",
                lastName: "",
                email: "",
                country: null,
                preferredLanguage: "English",
                jobTitle: ""
              },
              isFieldEmpty: true
            });
            //Refreshes the state on error.
            ["view", "edit"].map(mode =>
              this.changePersonalInfoFieldsMode(mode)
            );
          } else {
            let { profile } = userData.userDetails;
            this.setState({
              existingOktaUserDetails: {
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                country: {
                  label: profile.country,
                  value: profile.country
                },
                preferredLanguage: {
                  label: profile.preferredLanguage,
                  value:
                    profile.preferredLanguage === "en" ? "English" : "Spanish"
                },
                jobTitle: profile.jobTitle
                  ? {
                      label: profile.jobTitle,
                      value: profile.jobTitle
                    }
                  : ""
              },
              showExistingUserWarningDialog: true
            });
          }
        }
      );
    } else {
      let { fields } = this.state;
      fields = fields.map(field => {
        field.mode = "view";
        return field;
      });

      this.setState({
        userCreated: true,
        showCreateUserNotification: true,
        fields
      });
    }
  };

  changePersonalInfoFieldsMode = mode => {
    let { fields } = this.state;
    fields = fields.map(field => {
      field.mode = mode;
      return field;
    });
    this.setState({
      fields
    });
  };

  /**
   * * functionality on save.
   */
  handleSave = () => {
    const { user } = this.props;
    let userObj = null;

    if (this.props.user) {
      userObj = this.props.user.profile;
    } else {
      userObj = this.state.existingOktaUserDetails;
    }

    // console.log('handleSave', userObj)
    this.props.getInvitedUserDetails(
      { login: userObj.email || userObj.login },
      res => {
        const url = `${oktaBaseUrl}${res.id}/lifecycle/activate?sendEmail=true`;
        const activationData = { url };
        const userData = { userId: res.id };

        this.props.assignUserToApp(userData);
        this.props.sendActivationMail(activationData, () => {});
        this.saveUserMule(res);
      }
    );

    // if (user && user["_links"]) {
    //   let url = `${user["_links"]["activate"]["href"]}?sendEmail=true`;
    //   const activationData = {
    //     url
    //   };
    //   const userData = {
    //     userId: user["id"]
    //   };
    //   this.props.assignUserToApp(userData);
    //   this.props.sendActivationMail(activationData, () => {});
    // }
    // this.saveUserMule();
  };

  /**
   * * Returns updated assignment structure for inviteUser api call.
   */
  getUpdatedAssignment = () => {
    const { assignments } = this.state;
    const updatedAssignment = [];
    const parentListLabel = assignments[0].parentListLabel;
    assignments.map(assignment => {
      const childLabel = assignment.childListLabel;
      delete assignment.parentListLabel;
      delete assignment.childListLabel;
      // delete assignment.label;
      // delete assignment.value;
      const childAssignments = [];
      if (assignment.secondaryAssignments.length > 0) {
        assignment.secondaryAssignments.map(child => {
          // delete child.label;
          // delete child.value;
          child["TransactionStatus"] = "A";
          child["RanchStatus"] = 1;
          childAssignments.push(child);
        });
      } else {
        assignment["TransactionStatus"] = "A";
      }
      assignment[[childLabel]] = childAssignments;
      delete assignment.secondaryAssignments;
      updatedAssignment.push(assignment);
    });
    return { [parentListLabel]: updatedAssignment };
  };

  saveUserMule = user => {
    const { inviteUser, userDetails } = this.props;
    const { selectedPersona, personalInformation } = this.state;
    const assignmantData = this.getUpdatedAssignment();
    const userData = {
      PersonaDetails: {
        PersonaType: selectedPersona.value || selectedPersona,
        PersonaId: personaMap[selectedPersona.value || selectedPersona],
        UserOktaId: user.id,
        CreatedBy: userDetails.profile.persona,
        CreatedById: userDetails.id,
        UpdatedById: userDetails.id,
        CountryNumber: personalInformation.country.Number,
        CountryName: personalInformation.country.value
      }
    };
    userData[Object.keys(assignmantData)[0]] =
      assignmantData[Object.keys(assignmantData)[0]];
    inviteUser(userData, this.welcomeLetterSent);
  };

  welcomeLetterSent = () => {
    const { userDetails } = this.props;
    const selectedPersona =
      userDetails.profile.persona === "Super Admin" ||
      userDetails.profile.persona === "Regional Admin"
        ? null
        : this.state.selectedPersona || this.state.selectedPersona.value;
    this.setState({
      showInvitationNotification: true,
      userCreated: false,
      personalInformation: {
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        preferredLanguage: "",
        jobTitle: ""
      },
      selectedPersona: selectedPersona,
      isFieldEmpty: true,
      assignments: []
    });
    this.changePersonalInfoFieldsMode("edit");
  };

  handleCancel = () => {
    this.setState({
      showDialog: true
    });
  };

  /**
   * * Returns modified persona list.
   */
  filterPersona = () => {
    const { personaTypes, accessibleFeatures } = this.props;
    return (
      personaTypes &&
      personaTypes.filter(persona => {
        if (accessibleFeatures.personaType.indexOf(persona.Name) > -1) {
          persona.id = persona.id;
          persona.label = persona.Name;
          persona.value = persona.Name;
          return persona;
        }
      })
    );
  };

  /**
   * @returns assignment data based on persona.
   */
  getAssignmentData = () => {
    const {
      userDetails,
      districtAndBerryList,
      districtAndCompanyList,
      companyAndRanchList
    } = this.props;

    switch (userDetails.profile.persona) {
      case "Super Admin":
        return districtAndBerryList;

      case "Regional Admin":
        return districtAndCompanyList;

      case "Ranch Admin":
        return companyAndRanchList;

      default:
        break;
    }
  };

  render() {
    const { classes, accessibleFeatures, languageMap } = this.props;
    const {
      selectedPersona,
      userCreated,
      mode,
      showDialog,
      showExistingUserWarningDialog,
      showWelcomeLetter,
      showCreateUserNotification,
      showInvitationNotification,
      fields,
      personalInformation,
      isFieldEmpty,
      assignments,
      showErrorNotification,
      errorMessage,
      isFormValidated
      // languageMap
    } = this.state;
    const personaTypeOptions = this.filterPersona();
    const assignmentData = this.getAssignmentData();
    return (
      <div className={classes.root} id="massAlertContent">
        <div
          className="mass-alert-options-selection"
          style={{ display: "flex", marginTop: "50px" }}
        >
          <SelectMode
            id="districtSelect"
            mode="edit"
            value=""
            options={[]}
            handleChange={this.handleSelectChange}
            width="20%"
            placeholder="Select districts"
          />
          <SelectMode
            id="areaSelect"
            mode="edit"
            value=""
            options={[]}
            handleChange={this.handleSelectChange}
            width="20%"
            placeholder="Select producing area"
          />
          <SelectMode
            id="berrySelect"
            mode="edit"
            value=""
            options={[]}
            handleChange={this.handleSelectChange}
            width="20%"
            placeholder="Select berry type"
          />
          <SelectMode
            id="fieldSelect"
            mode="edit"
            value=""
            options={[]}
            handleChange={this.handleSelectChange}
            width="20%"
            placeholder="Select field type"
          />
          <div>
            <IconButton
              color="inherit"
              onClick={() => {
                console.log("Clicked");
              }}
              className={classes.iconButton}
            >
              <AddCircleTwoTone className={classes.icon} />
              <Typography style={{ marginLeft: "5px" }}>ADD</Typography>
            </IconButton>
          </div>
        </div>

        <div className="alert-options-container" style={{ marginTop: "20px" }}>
          <div className="alert-option">
            <Typography
              variant="subtitle2"
              gutterBottom
              style={{ fontWeight: "bold" }}
            >
              <Icon
                className="far fa-trash-alt"
                style={{
                  fontSize: "15px",
                  color: "#009dee",
                  marginRight: "40px"
                }}
              />
              Northern California
            </Typography>

            <div className="alert-option-districts">
              <div
                className="alert-option-district-item"
                style={{ marginLeft: "70px", marginTop: "10px" }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  <Icon
                    className="fas fa-chevron-right"
                    style={{ fontSize: "11px", marginRight: "10px" }}
                  />
                  Watsonville - 1
                </Typography>

                <div className="alert-option-berry-field">
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    style={{ marginLeft: "20px" }}
                  >
                    Strawberry &nbsp;&nbsp;&nbsp;&nbsp; ORGANIC
                  </Typography>
                </div>
              </div>

              <div
                className="alert-option-district-item"
                style={{ marginLeft: "70px", marginTop: "15px" }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  <Icon
                    className="fas fa-chevron-right"
                    style={{ fontSize: "11px", marginRight: "10px" }}
                  />
                  Salinas - 2
                </Typography>

                <div className="alert-option-berry-field">
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    style={{ marginLeft: "20px" }}
                  >
                    Blueberry &nbsp;&nbsp;&nbsp;&nbsp; ORGANIC
                  </Typography>
                </div>

                <div className="alert-option-berry-field">
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    style={{ marginLeft: "20px" }}
                  >
                    Strawberry &nbsp;&nbsp;&nbsp;&nbsp; TRANSITIONAL
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="alert-option" style={{ marginTop: "10px" }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              style={{ fontWeight: "bold" }}
            >
              <Icon className="far fa-trash-alt" style={{ fontSize: "15px", color: "#009dee", marginRight: "40px" }} />
              Southern California
            </Typography>

            <div className="alert-option-districts">
              <div className="alert-option-district-item" style={{ marginLeft: "70px", marginTop: "10px" }}>
                <Typography variant="subtitle2" gutterBottom>
                  <Icon className="fas fa-chevron-right" style={{ fontSize: "11px", marginRight: "10px" }} />
                  Oxnard - 4
                </Typography>

                <div className="alert-option-berry-field">
                  <Typography variant="subtitle2" gutterBottom style={{ marginLeft: "20px" }}>
                    Blackberry &nbsp;&nbsp;&nbsp;&nbsp; CONVENTIONAL
                  </Typography>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div
          className="alert-description-container"
          style={{ marginTop: "30px" }}
        >
          <Form id="alertForm">
            <div className="alert-title">
              <Typography
                variant="subtitle2"
                className={classes.subtitle}
                gutterBottom
              >
                Alert Title
              </Typography>
              <CustomInput
                required
                id="outlined-required"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                onChange={() => {
                  console.log("works");
                }}
                value={""}
                validations={[required]}
              />
            </div>

            <div className="alert-description" style={{ marginTop: "15px" }}>
              <Typography
                variant="subtitle2"
                className={classes.subtitle}
                gutterBottom
              >
                Alert Description
              </Typography>
              <CustomInput
                required
                multiline
                rows="4"
                rowsMax="10"
                id="outlined-required"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                onChange={() => {
                  console.log("works");
                }}
                value={""}
                validations={[required]}
              />
            </div>
          </Form>
        </div>

        {/*<PersonaType*/}
        {/*mode={*/}
        {/*accessibleFeatures.personaType.length === 1 || userCreated*/}
        {/*? "view"*/}
        {/*: mode*/}
        {/*}*/}
        {/*accessibleFeatures={accessibleFeatures.personaType}*/}
        {/*personaTypes={personaTypeOptions}*/}
        {/*handlePersonaChange={this.handlePersonaChange}*/}
        {/*selectedPersona={selectedPersona}*/}
        {/*languageMap={languageMap}*/}
        {/*/>*/}

        {/*{selectedPersona && (*/}
        {/*<PersonalInformation*/}
        {/*fields={fields}*/}
        {/*handlePersonalInformationInput={this.handlePersonalInformationInput}*/}
        {/*inputDetails={personalInformation}*/}
        {/*selectedPersona={selectedPersona || selectedPersona.value}*/}
        {/*mode="invite"*/}
        {/*languageMap={languageMap}*/}
        {/*isFormValidated={isFormValidated}*/}
        {/*/>*/}
        {/*)}*/}

        {/*{selectedPersona && !userCreated && (*/}
        {/*<div className={classes.buttonContainer}>*/}
        {/*<Button*/}
        {/*variant="contained"*/}
        {/*size="large"*/}
        {/*className={classes.button}*/}
        {/*color="primary"*/}
        {/*onClick={this.handleCreateUser}*/}
        {/*disabled={isFieldEmpty ? true : false}*/}
        {/*>*/}
        {/*{languageMap.createUser}*/}
        {/*</Button>*/}
        {/*</div>*/}
        {/*)}*/}

        {/*{userCreated && (*/}
        {/*<AssignmentGeneric*/}
        {/*mode="create"*/}
        {/*languageMap={languageMap}*/}
        {/*selectedPersona={selectedPersona.value || selectedPersona }*/}
        {/*accessibleFeatures={*/}
        {/*accessibleFeatures.assignment[selectedPersona.value || selectedPersona]*/}
        {/*}*/}
        {/*assignmentList={assignmentData}*/}
        {/*updateAssignment={this.updateAssignment}*/}
        {/*/>*/}
        {/*)}*/}

        {/** Welcome letter, save & send buttons*/}
        {true && (
          <div className={classes.welcome}>
            {/*<Typography*/}
            {/*variant="subtitle1"*/}
            {/*gutterBottom*/}
            {/*className={classes.viewLetter}*/}
            {/*onClick={this.toggleWelcomeLetter}*/}
            {/*>*/}
            {/*<u>{languageMap.viewWelcomeLetter}</u>*/}
            {/*</Typography>*/}

            {/*<WelcomeLetter*/}
            {/*open={showWelcomeLetter}*/}
            {/*handleClose={this.toggleWelcomeLetter}*/}
            {/*preferredLanguage={personalInformation.preferredLanguage.value}*/}
            {/*personalInformation={personalInformation}*/}
            {/*/>*/}

            <div className={classes.buttonContainerSave}>
              <Button
                variant="contained"
                size="large"
                className={classes.button}
                color="primary"
                onClick={this.handleSave}
              >
                {languageMap.saveAndSend}
              </Button>
            </div>
          </div>
        )}
        <Notification
          hideNotification={this.hideNotification}
          open={showCreateUserNotification}
          message={languageMap.newUserHasBeenSuccessfullyCreated}
          notificationType={"create-user"}
        />
        <Notification
          hideNotification={this.hideNotification}
          open={showInvitationNotification}
          message={languageMap.welcomeLetterSent}
          notificationType={"save-send"}
        />
        <Notification
          hideNotification={this.hideNotification}
          open={showErrorNotification}
          message={errorMessage}
          notificationType={"error"}
        />
        <DialogBox
          modalMessage={"User already exists"}
          modalTitle={"Continue?"}
          open={showExistingUserWarningDialog}
          handleClose={this.handleDialogClose}
          onClickYes={this.handleDialogClickYes}
          onClickNo={this.handleDialogClose}
        />
      </div>
    );
  }
}

MassAlerts.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    districtAndBerryList: state.persona.districtAndBerryList,
    districtAndCompanyList: state.persona.districtAndCompanyList,
    companyAndRanchList: state.persona.companyAndRanchList,
    user: state.user.invitedUser,
    invitedUserDetails: state.user.invitedUserDetails,
    languageMap: state.language.language
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getDistrictAndBerryList,
      getCompanyAndRanchList,
      getDistrictAndCompanyList,
      sendActivationMail,
      assignUserToApp,
      inviteUser,
      findUserInMule,
      getInvitedUserDetails,
      setPreferredLanguage
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MassAlerts));
