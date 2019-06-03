import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PersonalInformation from "../../components/PersonalInformation";
import DialogBox from "../../components/DialogBox";
import Notification from "../../components/Notification";
import AssignmentGeneric from "../../components/AssignmentGeneric";
import personaMap from "../../login/config/persona";
import { jobTitles, language } from "../../login/config/index";

import English from "../../login/config/language/english";
import Spanish from "../../login/config/language/spanish";

//import actions
import {
  getDistrictAndBerryList,
  getDistrictAndCompanyList
} from "../../services/actions/persona.action";
import {
  updateUserProfile,
  getUserDetails
} from "../../services/actions/user.action";
import { setPreferredLanguage } from "../../services/actions/language.action";
import PersonaType from "../../components/InviteUser/PersonaType";

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: "6rem 5% 2rem 5%"
  },
  button: {
    margin: theme.spacing.unit,
    fontSize: "1rem",
    alignSelf: "flex-end",
    position: "absolute",
    right: 0,
    marginRight: "5%"
  },
  buttonContainer: {
    padding: "1rem",
    display: "flex",
    flexDirection: "column"
  }
});

const TableCellLink = () => (
  <a
    href="https://s3.us-east-2.amazonaws.com/gpastaticfiles/faq.pdf"
    target="pdflink"
  >
    terms &amp; privacy policy
  </a>
);

// const languageMap = JSON.parse(localStorage.getItem("languageMap"));

class Register extends Component {
  state = {
    showDialog: false,
    showRegisterUserNotification: false,
    phoneNo: "",
    isFieldEmpty: true,
    isTermschecked: false,
    profileUpdateData: {
      primaryPhone: this.props.userProfile.primaryPhone || "",
      secondaryPhone: this.props.userProfile.secondaryPhone || "",
      jobTitle: "",
      preferredLanguage: this.props.userProfile.preferredLanguage || ""
    },
    fields: [
      {
        label: "firstName",
        type: "input",
        mode: "view",
        width: "30%"
      },
      {
        label: "lastName",
        type: "input",
        mode: "view",
        width: "30%"
      },
      { label: "email", type: "input", mode: "view", width: "30%" },
      { label: "primaryPhone", type: "phoneNo", width: "30%", mode: "view" },
      {
        label: "secondaryPhone",
        type: "phoneNo",
        width: "30%",
        mode: "edit"
      },

      {
        label: "country",
        type: "input",
        mode: "view",
        width: "30%"
      },
      {
        label: "preferredLanguage",
        type: "select",
        mode: "edit",
        options: language,
        placeholder:
          this.props.userProfile.preferredLanguage === "en"
            ? "English"
            : "Spanish" || "English",
        width: "25%"
      }
    ],
    languageMap: English
  };

  componentDidMount() {
    const { userProfile } = this.props;
    const { fields } = this.state;
    userProfile.persona === "Ranch Admin" &&
      fields.splice(5, 0, {
        label: "jobTitle",
        type: "select",
        mode: "edit",
        options: jobTitles,
        placeholder: userProfile.jobTitle,
        width: "25%"
      }) &&
      this.setState({
        fields: fields
      });
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
    const { userProfile } = this.props;
    if (userProfile) {
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
      userProfile
    } = this.props;

    switch (userProfile.persona) {
      case "Harvest Planner":
      case "Regional Admin":
        return getDistrictAndBerryList({
          personaid: personaMap[userProfile.persona],
          useroktaid: loggedInUser.sub || loggedInUser.userId
        });

      case "Ranch Admin":
        return getDistrictAndCompanyList({
          personaid: personaMap[userProfile.persona],
          useroktaid: loggedInUser.sub || loggedInUser.userId
        });

      default:
        break;
    }
  };

  handleProfileUpdateData = (id, value) => {
    const { profileUpdateData, isTermschecked } = this.state;
    const { userProfile, diplayTermCondition } = this.props;
    //console.log(profileUpdateData[id]);
    // this.setState({
    //   profileUpdateData[id]: value
    // })
    this.setState(prevState => ({
      profileUpdateData: {
        ...prevState.profileUpdateData,
        [id]: value
      }
    }));
    // this.setState({
    //   profileUpdateData
    // });
    let isFieldEmpty = false;
    let trimmedNo = "";
    let trimmedSecNo = "";
    if (profileUpdateData.primaryPhone !== undefined) {
      trimmedNo = profileUpdateData.primaryPhone.replace(/\D/g, "");
    }
    if (profileUpdateData.secondaryPhone !== undefined) {
      trimmedSecNo = profileUpdateData.secondaryPhone.replace(/\D/g, "");
    }
    if (trimmedNo.length < 10) {
      isFieldEmpty = true;
    } else {
      if (userProfile.persona == "Ranch Admin" && diplayTermCondition) {
        isTermschecked === true
          ? (isFieldEmpty = false)
          : (isFieldEmpty = true);
      }
    }
    this.setState({ isFieldEmpty });
  };

  /**
   * functions to control Dialog Box.
   */

  handleDialogClose = () => {
    this.setState({
      showDialog: false
    });
  };

  handleDialogClickYes = () => {
    localStorage.clear();
    this.props.logout();
  };

  /**
   * controls Notifications.
   */

  hideNotification = (notificationType, visible) => {
    if (notificationType === "update-profile") {
      this.setState({
        showRegisterUserNotification: visible
      });
    }
  };
  /**
   * * implements respective functionalities on buntton's click.
   */

  handleSave = () => {
    const { profileUpdateData } = this.state;
    const { loggedInUser } = this.props;
    let tempLanguage = "";
    if (profileUpdateData.preferredLanguage.value !== undefined) {
      tempLanguage =
        profileUpdateData.preferredLanguage.value === "English" ? "en" : "esp";
    } else tempLanguage = profileUpdateData.preferredLanguage;
    const userData = {
      login: loggedInUser.email || loggedInUser.login,
      preferredLanguage: tempLanguage,

      primaryPhone: profileUpdateData.primaryPhone,
      secondaryPhone: profileUpdateData.secondaryPhone,
      jobTitle: profileUpdateData.jobTitle.value
    };

    this.props.updateUserProfile(userData, error => {
      // only re-set user in localStorage if update profile is success
      if (!error) {
        // this.props.getUserDetails({ login: loggedInUser.email || loggedInUser.login }, (res) => {
        //   let { preferredLanguage } = res.profile;
        this.userUpdatedSuccessfully(userData);
        // })
      }
    });
  };

  userUpdatedSuccessfully = userData => {
    const {
      registerUser,
      setPreferredLanguage,
      loggedInUser,
      changeTriggerData
    } = this.props;
    const languageMap =
      userData.preferredLanguage === "en" ? "English" : "Spanish";
    changeTriggerData();
    localStorage.setItem("preferredLanguage", userData.preferredLanguage);
    setPreferredLanguage(
      { login: loggedInUser.email || loggedInUser.login },
      () => {
        this.setState({
          showRegisterUserNotification: true,
          isUserDataChanged: true
        });
        this.setState({ languageMap }, () => {
          setTimeout(registerUser, 2000);
        });
      }
    );
  };

  handleCancel = () => {
    this.setState({
      showDialog: true
    });
  };

  handlecheckChange = event => {
    const { isTermschecked } = this.state;
    this.setState(
      {
        isTermschecked: event.target.checked
      },
      () => this.handleProfileUpdateData()
    );
  };
  /**
   * sets assignment message.
   */

  getAssigmentMessage = () => {
    const { userProfile } = this.props;
    switch (userProfile.persona) {
      case "Harvest Planner":
        return "assignedDistrictsAndBerryTypes";
      case "Regional Admin":
        return "assignedDistricts";
      case "Ranch Admin":
        return "assignedCompanies";
      default:
        break;
    }
  };

  /**
   * @returns assignment data based on persona.
   */
  getAssignmentData = () => {
    const {
      userProfile,
      districtAndBerryList,
      districtAndCompanyList
    } = this.props;

    switch (userProfile.persona) {
      case "Harvest Planner":
        return districtAndBerryList;

      case "Regional Admin":
        districtAndBerryList &&
          districtAndBerryList.map(item => (item.secondaryAssignments = []));
        return districtAndBerryList;

      case "Ranch Admin":
        return districtAndCompanyList;

      default:
        break;
    }
  };

  render() {
    const {
      classes,
      userProfile,
      diplayTermCondition,
      language: languageMap,
      showUserProfileUpdatedNotification
    } = this.props;
    const {
      showDialog,
      showRegisterUserNotification,
      fields,
      profileUpdateData,
      isFieldEmpty,
      isTermschecked
      // languageMap
    } = this.state;

    const assignmentMessage = this.getAssigmentMessage();
    const assignmentData = this.getAssignmentData();

    return (
      <div className={classes.root}>
        <Typography variant="h6" gutterBottom color="secondary">
          {languageMap.profileUpdate}
        </Typography>
        <PersonalInformation
          fields={fields}
          userData={userProfile}
          handlePersonalInformationInput={this.handleProfileUpdateData}
          inputDetails={profileUpdateData}
          languageMap={languageMap}
          mode="register"
        />

        {assignmentData && assignmentData.length > 0 && (
          <AssignmentGeneric
            mode="view"
            selectedPersona={"Ranch Admin"}
            registerAssignMessage={assignmentMessage}
            data={assignmentData}
            languageMap={languageMap}
          />
        )}

        <div className={classes.buttonContainer}>
          {userProfile.persona === "Ranch Admin" && diplayTermCondition && (
            <div style={{ flexDirection: "row" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isTermschecked}
                    onChange={e => this.handlecheckChange(e)}
                    value={isTermschecked}
                  />
                }
                label="I agree to Driscoll's"
                style={{ marginRight: "5px" }}
              />
              <Link component={TableCellLink} className={classes.linkFont} />
            </div>
          )}

          {/*<Button
            variant="outlined"
            size="large"
            color="secondary"
            className={classes.button}
            onClick={this.handleCancel}
          >
            {languageMap.cancel}
          </Button>*/}

          <Button
            variant="contained"
            size="large"
            className={classes.button}
            color="primary"
            onClick={this.handleSave}
            disabled={isFieldEmpty ? true : false}
          >
            {languageMap.save}
          </Button>
          <Notification
            hideNotification={this.hideNotification}
            open={showRegisterUserNotification}
            message={
              showUserProfileUpdatedNotification
                ? languageMap.userProfileUpdatedSuccessfully
                : languageMap.userUpdatedSuccessfully
            }
            notificationType={"update-profile"}
          />

          <DialogBox
            modalMessage={languageMap.areYouSureYouWantToCancel}
            modalTitle={languageMap.cancelInvitation}
            open={showDialog}
            handleClose={this.handleDialogClose}
            onClickYes={this.handleDialogClickYes}
            onClickNo={this.handleDialogClose}
          />
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    districtAndBerryList: state.persona.districtAndBerryList,
    districtAndCompanyList: state.persona.districtAndCompanyList,
    language: state.language.language
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getDistrictAndBerryList,
      getDistrictAndCompanyList,
      updateUserProfile,
      getUserDetails,
      setPreferredLanguage
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Register));
