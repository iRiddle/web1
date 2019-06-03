import { apis } from "../api";
import {
  GET_MASS_ALERT_DISTRICT_LIST_SUCCESS,
  GET_MASS_ALERT_RANCH_LIST_SUCCESS
} from "../constants";

export const getMassAlertDistrictList = data => {
  return dispatch => {
    apis.getMassAlertDistrictList(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
      }
      if (response && !response.errorCode) {
        dispatch({
          type: GET_MASS_ALERT_DISTRICT_LIST_SUCCESS,
          payload: response
        });
      }
    });
  };
};

export const getMassAlertRanchList = data => {
  return dispatch => {
    apis.getMassAlertRanchList(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
      }
      if (response && !response.errorCode) {
        dispatch({
          type: GET_MASS_ALERT_RANCH_LIST_SUCCESS,
          payload: response
        });
      }
    });
  };
};

export const postMassAlert = (data, callback) => {
  return dispatch => {
    apis.postMassAlert(data, dispatch, (err) => {
      callback(err);
    });
  };
};
