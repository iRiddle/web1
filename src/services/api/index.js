import {
  createOktaUserUrl,
  getUserDetails,
  basicInformation,
  districtAndBerryList,
  districtAndCompanyList,
  companyAndRanchList,
  assignUserToApp,
  updateUser,
  sendActivationMail,
  inviteUser,
  getUserDetailsList,
  updateOktaUserUrl,
  associatedUsersList,
  getRemindersList,
  updateReminder,
  getUserDetail,
  getMassAlertDistrictList,
  getMassAlertRanchList,
  postMassAlert
} from "./urls";
import makeCall from "./service";

export const apis = {
  postMassAlert: (data, dispatch, callback) => {
    var url = postMassAlert;
    makeCall(
      {
        url,
        method: "POST",
        data
      },
      dispatch,
      callback
    );
  },

  getMassAlertRanchList: (data, dispatch, callback) => {
    var url = getMassAlertRanchList;
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },

  getMassAlertDistrictList: (data, dispatch, callback) => {
    var url = getMassAlertDistrictList;
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },

  getRemindersList: (data, dispatch, callback) => {
    var url = getRemindersList;
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },

  updateReminder: (data, dispatch, callback) => {
    let url = updateReminder;
    makeCall(
      {
        url,
        method: "POST",
        data,
      },
      dispatch,
      callback
    );
  },

  getUserDetail: (data, dispatch, callback) => {
    var url = getUserDetail + data.id;
    makeCall(
      {
        url,
        method: "GET",
        server: "OKTA"
      },
      dispatch,
      callback
    );
  },
  
  createOktaUser: (data, dispatch, callback) => {
    let url = createOktaUserUrl;
    makeCall(
      {
        url,
        method: "POST",
        data,
        server: "OKTA"
      },
      dispatch,
      callback
    );
  },

  updateOktaUser: (data, dispatch, callback) => {
    let url = updateOktaUserUrl + data.PersonaDetails.UserOktaId;
    makeCall(
      {
        url,
        method: "PUT",
        data,
      },
      dispatch,
      callback
    );
  },

  getUserDetails: (data, dispatch, callback) => {
    var url = getUserDetails;
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },

  getInvitedUserDetails: (data, dispatch, callback) => {
    var url = getUserDetails;
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },

  getUserDetailsList: (data, dispatch, callback) => {
    var url = getUserDetailsList;
    makeCall(
      {
        url,
        method: "POST",
        data
      },
      dispatch,
      callback
    );
  },

  getCurrentUserDetailsList: (data, dispatch, callback) => {
    var url = districtAndBerryList;
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },

  getAssociatedUsersList: (data, dispatch, callback) => {
    var url = associatedUsersList;
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },

  sendActivationMail: (data, dispatch, callback) => {
    var url = sendActivationMail;
    makeCall(
      {
        url,
        method: "POST",
        data
      },
      dispatch,
      callback
    );
  },
  assignUserToApp: (data, dispatch, callback) => {
    let url = assignUserToApp;
    makeCall(
      {
        url,
        method: "POST",
        data
      },
      dispatch,
      callback
    );
  },
  updateUser: (data, dispatch, callback) => {
    var url = updateUser;
    makeCall(
      {
        url,
        method: "POST",
        data
      },
      dispatch,
      callback
    );
  },
  inviteUser: (data, dispatch, callback) => {
    var url = inviteUser + data.PersonaDetails.UserOktaId;
    makeCall(
      {
        url,
        method: "POST",
        data
      },
      dispatch,
      callback
    );
  },
  findUser: (data, dispatch, callback) => {
    var url = inviteUser + data.userOktaId;
    data = {};
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },

  getBasicInformation: (data, dispatch, callback) => {
    var url = basicInformation;
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },

  getDistrictAndBerryList: (data, dispatch, callback) => {
    var url = districtAndBerryList;
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },
  getDistrictAndCompanyList: (data, dispatch, callback) => {
    var url = districtAndCompanyList;
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },
  getCompanyAndRanchList: (data, dispatch, callback) => {
    var url = companyAndRanchList;
    makeCall(
      {
        url,
        method: "GET",
        data
      },
      dispatch,
      callback
    );
  },
};
