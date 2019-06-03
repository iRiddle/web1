import {apis} from "../api";
import English from "../../login/config/language/english";
import Spanish from "../../login/config/language/spanish";
import {SET_PREFERRED_LANGUAGE} from "../constants";

export const setPreferredLanguage = (data, callback) => {
  return dispatch => {
    apis.getUserDetails(data, dispatch, (err, response) => {
      if (err) {
        callback(err);
        console.log(err);
      }
      if (response && !response.errorCode) {
        callback(response);
        const prefLang = response.profile.preferredLanguage === 'en' ? English : Spanish;

        dispatch({
          type: SET_PREFERRED_LANGUAGE,
          payload: prefLang
        })
      }
    });
  };
}
