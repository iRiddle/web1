import {
  GET_REMINDERS_LIST_SUCCESS
} from "../constants";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_REMINDERS_LIST_SUCCESS:
      return {
        ...state,
        remindersList: action.payload
      };

    default:
      return state;
  }
};
  