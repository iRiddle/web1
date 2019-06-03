import { USER_AUTH_SUCCESS, USER_LOGOUT_REQUEST } from "../constants";

export default (
  state = {
    user: null
  },
  action
) => {
  switch (action.type) {
    case USER_AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload
      };

    case USER_LOGOUT_REQUEST:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};
