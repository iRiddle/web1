import { apis } from "../api";
import {
  CREATE_OKTA_USER_SUCCESS,
  SEND_ACTIVATION_MAIL_SUCCESS,
  GET_USER_DETAILS_SUCCESS,
  UPDATE_USER_PROFILE_SUCCESS,
  INVITE_USER_SUCCESS,
  GET_USER_DETAILS_LIST_SUCCESS,
  GET_ASSOCIATED_USERS_LIST_SUCCESS,
  FILTER_USER_DETAILS_LIST,
  GET_INVITED_USER_DETAILS,
  SET_PREFERRED_LANGUAGE,
  UPDATE_OKTA_USER_SUCCESS
} from "../constants";
import customErrors from "../../login/config/errors";
import English from "../../login/config/language/english";
import Spanish from "../../login/config/language/spanish";

export const createOktaUser = (data, callback) => {
  return dispatch => {
    apis.createOktaUser(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
        callback(customErrors[err.response.data.errorCauses[0].errorSummary]);
      }
      if (response && !response.errorCode) {
        callback(null);
        dispatch({
          type: CREATE_OKTA_USER_SUCCESS,
          payload: response
        });
      }
    });
  };
};

export const updateOktaUser = (data, callback) => {
  return dispatch => {
    apis.updateOktaUser(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
      }
      if (response && !response.errorCode) {
        callback(null);
        dispatch({
          type: UPDATE_OKTA_USER_SUCCESS,
          payload: response
        });
      }
    });
  };
};

export const updateUserProfile = (data, callback) => {
  return dispatch => {
    apis.updateUser(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
        callback(err);
      }
      if (response && !response.errorCode) {
        callback();
        dispatch({
          type: UPDATE_USER_PROFILE_SUCCESS,
          payload: response
        });
      }
    });
  };
};

export const inviteUser = (data, callback) => {
  return dispatch => {
    apis.inviteUser(data, dispatch, (err, response) => {
      if (err) {
        callback();
      }
      if (response && !response.errorCode) {
        callback();
        dispatch({
          type: INVITE_USER_SUCCESS,
          payload: response
        });
      }
    });
  };
};

/**
 *
 * @param {userOktaId} data
 * @param {*} callback
 * @returns {boolean} true if user exists in RDS else returns false
 */
export const findUserInMule = (data, callback) => {
  return dispatch => {
    apis.getUserDetails(data, dispatch, (err, userDetails) => {
      if (err) {
        console.log(err);
        callback(err, false);
      } else {
        apis.findUser(
          { userOktaId: userDetails.id },
          dispatch,
          (err, response) => {
            let userData = { isUserPresent: false, userDetails };
            if (response && response.UserOktaId) {
              userData.isUserPresent = true;
            }
            callback(err, userData);
          }
        );
      }
    });
  };
};

export const getUserDetails = (data, callback, isEdit) => {
  return dispatch => {
    apis.getUserDetails(data, dispatch, (err, response) => {
      if (err) {
        callback(err);
        console.log(err);
      }
      if (response && !response.errorCode) {
        callback(response);
        const prefLang =
          response.profile.preferredLanguage === "en" ? English : Spanish;
        if (!isEdit) {
          dispatch({
            type: GET_USER_DETAILS_SUCCESS,
            payload: response
          });
        }

        // dispatch({
        //   type: SET_PREFERRED_LANGUAGE,
        //   payload: prefLang
        // })
      }
    });
  };
};

export const getInvitedUserDetails = (data, callback) => {
  return dispatch => {
    apis.getInvitedUserDetails(data, dispatch, (err, response) => {
      if (err) {
        callback(err);
        console.log(err);
      }
      if (response && !response.errorCode) {
        callback(response);
        dispatch({
          type: GET_INVITED_USER_DETAILS,
          payload: response
        });
      }
    });
  };
};

/**
 *
 * @param {userOktaIds} data Array of OKTA ids
 * @param {*} callback
 * @returns {*} User details map for each OKTA id
 */
export const getUserDetailsList = (data, callback) => {
  return dispatch => {
    apis.getUserDetailsList(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
      }
      if (response) {
        dispatch({
          type: GET_USER_DETAILS_LIST_SUCCESS,
          payload: response
        });
      }
    });
  };
};

export const filterUserDetailsList = (data, callback) => {
  return dispatch => {
    dispatch({
      type: FILTER_USER_DETAILS_LIST,
      payload: data
    });
  };
};

/**
 *
 * @param {userOktaIds} data Array of OKTA ids
 * @param {*} callback
 * @returns {*} User details map for each OKTA id
 */
export const getAssociatedUsersList = (data, callback) => {
  return dispatch => {
    apis.getAssociatedUsersList(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
        callback(err);
      }
      if (response) {
        callback(null, response);
        dispatch({
          type: GET_ASSOCIATED_USERS_LIST_SUCCESS,
          payload: response
        });
      }
    });
  };
};

export const sendActivationMail = (data, callback) => {
  return dispatch => {
    apis.sendActivationMail(data, dispatch, (err, response) => {
      if (err) {
        callback(err);
        console.log(err);
      }
      if (response) {
        callback();
        dispatch({
          type: SEND_ACTIVATION_MAIL_SUCCESS
        });
      }
    });
  };
};

export const assignUserToApp = data => {
  return dispatch => {
    apis.assignUserToApp(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
      }
    });
  };
};
