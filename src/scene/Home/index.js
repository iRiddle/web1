import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import NavMenuWrapper from "../../components/NavMenuWrapper";
import InviteUser from "../InviteUser";
import FaqsList from "../FaqsList";
import MassAlerts from "../MassAlerts";
import ReminderTime from "../ReminderTime";
import getAccessibleFeatures from "../../login/config/accessible-features/index";

//actions
import {
  getUserDetails,
  createOktaUser
} from "../../services/actions/user.action";
import { logout } from "../../services/actions/auth.action";
import { getBasicInformation } from "../../services/actions/persona.action";
import Register from "../Register";
import personaMap from "../../login/config/persona";
import ManageUser from "../ManageUser";

import English from "../../login/config/language/english";
import Spanish from "../../login/config/language/spanish";

const style = {
  main: {
    position: "absolute",
    marginTop: "9rem",
    width: "89%",
    marginRight: "5.5%",
    marginLeft: "5.5%"
  }
};

class Home extends Component {
  state = {
    selectedMenuIndex: 0,
    userDetails: null,
    isRegistered: false,
    showUserProfile: false,
    showTermsCondition: true,
    showUserProfileUpdatedNotification: false,
    languageMap: English
  };

  componentDidMount() {
    this.getLanguageMap();
    this.initNetworkCalls();
  }

  getLanguageMap() {
    const preferredLanguage = localStorage.getItem("preferredLanguage");
    let languageMap = preferredLanguage === "esp" ? Spanish : English;

    this.setState({ languageMap });
  }

  initNetworkCalls = () => {
    const { loggedInUser, getUserDetails, getBasicInformation } = this.props;
    getUserDetails(
      { login: loggedInUser.email || loggedInUser.login },
      this.checkIsRegistered
    );
    // !EXCEPTION: need to pass param for this API call.
    getBasicInformation({ country: 0 });
  };

  checkIsRegistered = response => {
    this.setState({
      isRegistered: Boolean(response.profile && response.profile.isRegistered)
    });
  };

  /**
   * * Updates the state on Register.
   */
  registerUser = () => {
    this.setState({
      isRegistered: true,
      showUserProfile: false,
      showUserProfileUpdatedNotification: false
    });
  };

  /**
   * * Sets main menu new index
   */
  handleMenuItemChange = value => {
    this.setState({ selectedMenuIndex: value });
  };

  showUserProfile = () => {
    this.setState({
      showUserProfile: true,
      showTermsCondition: false,
      showUserProfileUpdatedNotification: true
    });
  };

  showHome = () => {
    this.setState({
      showUserProfile: false
    });
  };

  getCountryListOptions = () => {
    const { countryList } = this.props;
    return (
      countryList &&
      countryList.map(country => {
        country.label = country.Name;
        country.value = country.Name;
        return country;
      })
    );
  };
  changeTriggerData = () => {
    this.initNetworkCalls();
  };
  render() {
    const {
      selectedMenuIndex,
      isRegistered,
      showUserProfile,
      showTermsCondition,
      languageMap,
      showUserProfileUpdatedNotification
    } = this.state;
    const {
      userDetails,
      createOktaUser,
      logout,
      loggedInUser,
      personaTypes
    } = this.props;

    const accessibleFeatures =
      userDetails && getAccessibleFeatures(userDetails.profile.persona);
    const countryList = this.getCountryListOptions();

    // console.log(accessibleFeatures)

    return (
      <div>
        {userDetails && (
          <NavMenuWrapper
            menuItems={Object.keys(accessibleFeatures)}
            selectedMenuIndex={selectedMenuIndex}
            handleMenuItemChange={this.handleMenuItemChange}
            userProfile={userDetails.profile}
            showMainMenu={isRegistered && !showUserProfile}
            showHome={this.showHome}
            handleViewProfile={this.showUserProfile}
            languageMap={languageMap}
          />
        )}

        {((userDetails && !isRegistered) || showUserProfile) && (
          <Register
            userProfile={userDetails.profile}
            registerUser={this.registerUser}
            loggedInUser={loggedInUser}
            logout={logout}
            diplayTermCondition={showTermsCondition}
            showUserProfileUpdatedNotification={
              showUserProfileUpdatedNotification
            }
            changeTriggerData={this.changeTriggerData}
          />
        )}
        {userDetails &&
          userDetails.profile.persona !== "Harvest Planner" &&
          isRegistered &&
          !showUserProfile &&
          personaTypes && (
            <main style={style.main}>
              {selectedMenuIndex === 0 && (
                <InviteUser
                  accessibleFeatures={accessibleFeatures.inviteUsers}
                  countryList={countryList}
                  createOktaUser={createOktaUser}
                  userDetails={userDetails}
                  loggedInUser={loggedInUser}
                  personaTypes={personaTypes}
                />
              )}

              {selectedMenuIndex === 1 && (
                <ManageUser
                  personaTypes={personaTypes}
                  accessibleFeatures={
                    accessibleFeatures.manageUsers.personaType
                  }
                  persona={userDetails.profile.persona}
                  oktaId={userDetails.id}
                />
              )}

              {(userDetails.profile.persona === "Regional Admin" ||
              userDetails.profile.persona === "Ranch Admin") &&
                selectedMenuIndex === 2 && (
                  <MassAlerts
                    accessibleFeatures={accessibleFeatures.inviteUsers}
                    countryList={countryList}
                    createOktaUser={createOktaUser}
                    userDetails={userDetails}
                    loggedInUser={loggedInUser}
                    personaTypes={personaTypes}
                  />
                )}

              {userDetails.profile.persona === "Super Admin" &&
                selectedMenuIndex === 2 && (
                  <FaqsList
                    personaTypes={personaTypes}
                    accessibleFeatures={
                      accessibleFeatures.manageUsers.personaType
                    }
                    persona={userDetails.profile.persona}
                    oktaId={userDetails.id}
                  />
                )}
              
              {userDetails.profile.persona === "Super Admin" &&
                selectedMenuIndex === 3 && (
                  <ReminderTime
                    personaTypes={personaTypes}
                    accessibleFeatures={
                      accessibleFeatures.manageUsers.personaType
                    }
                    persona={userDetails.profile.persona}
                    oktaId={userDetails.id}
                  />
                )}
            </main>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedInUser: state.auth.user,
    userDetails: state.user.userDetails,
    countryList: state.persona.countryList,
    personaTypes: state.persona.personaTypes
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getUserDetails,
      getBasicInformation,
      createOktaUser,
      logout
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
