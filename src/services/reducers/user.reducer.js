import {
  CREATE_OKTA_USER_SUCCESS,
  SEND_ACTIVATION_MAIL_SUCCESS,
  GET_USER_DETAILS_SUCCESS,
  GET_USER_DETAILS_LIST_SUCCESS,
  GET_ASSOCIATED_USERS_LIST_SUCCESS,
  FILTER_USER_DETAILS_LIST,
  GET_INVITED_USER_DETAILS,
  UPDATE_OKTA_USER_SUCCESS
} from "../constants";

export default (state = {}, action) => {
  switch (action.type) {
    case CREATE_OKTA_USER_SUCCESS:
      return {
        ...state,
        invitedUser: action.payload
      };

    case SEND_ACTIVATION_MAIL_SUCCESS:
      return {
        ...state,
        activationMailSent: true
      };

    case GET_USER_DETAILS_SUCCESS:
      return {
        ...state,
        userDetails: action.payload
      };

    case GET_INVITED_USER_DETAILS:
      return {
        ...state,
        invitedUserDetails: action.payload
      };
    case UPDATE_OKTA_USER_SUCCESS:
      return {
        ...state,
        updatedUser: action.payload
      };

    case GET_USER_DETAILS_LIST_SUCCESS:
      let userDetailsList = Object.assign({}, state.userDetailsList);
      let requestedPersona = Object.keys(action.payload)[0];
      userDetailsList[requestedPersona] = action.payload[requestedPersona];
      return {
        ...state,
        userDetailsList: userDetailsList,
        filterdUserDetailsList: userDetailsList
      };

    case FILTER_USER_DETAILS_LIST:
      let filterdUserDetailsList = Object.assign(
        {},
        state.filterdUserDetailsList
      );
      let persona = action.payload.persona;
      filterdUserDetailsList[persona] = action.payload.userDetails;
      return {
        ...state,
        filterdUserDetailsList: filterdUserDetailsList
      };

    case GET_ASSOCIATED_USERS_LIST_SUCCESS:
      return {
        ...state,
        associatedUsers: action.payload
      };

    default:
      return state;
  }
};
