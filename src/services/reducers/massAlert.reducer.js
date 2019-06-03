import {
  GET_MASS_ALERT_DISTRICT_LIST_SUCCESS,
  GET_MASS_ALERT_RANCH_LIST_SUCCESS
} from "../constants";

const initState = {
  massAlertDistrict: [],
  massAlertRanch: []
};

export default (state = initState, action) => {
  switch (action.type) {
    case GET_MASS_ALERT_DISTRICT_LIST_SUCCESS:
      return {
        ...state,
        massAlertDistrict: action.payload
      };

    case GET_MASS_ALERT_RANCH_LIST_SUCCESS:
      return {
        ...state,
        massAlertRanch: action.payload
      };

    default:
      return state;
  }
};
    