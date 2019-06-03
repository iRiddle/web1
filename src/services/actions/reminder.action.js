import { apis } from "../api";
import {
  GET_REMINDERS_LIST_SUCCESS
} from "../constants";

const getUserDetail = (data, dispatch) => {
  data.map(x => {
    apis.getUserDetail({id: x.CreatedBy}, dispatch, (err, response) => {
      if (!err) {
        x.CreatedByName = `${response.profile.firstName} ${response.profile.lastName}`;
      }
    });
    apis.getUserDetail({id: x.CreatedBy}, dispatch, (err, response) => {
      if (!err) {
        x.LastModifiedByName = `${response.profile.firstName} ${response.profile.lastName}`;
      }
    });
  });
};

export const getRemindersList = data => {
  return dispatch => {
    apis.getRemindersList(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
      }
      if (response && !response.errorCode) {
        getUserDetail(response, dispatch);

        setTimeout(function(){
          dispatch({
            type: GET_REMINDERS_LIST_SUCCESS,
            payload: response
          });
        }, 2000);
      }
    });
  };
};

export const updateReminder = data => {
  return dispatch => {
    apis.updateReminder(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
      }
    });
  };
};
