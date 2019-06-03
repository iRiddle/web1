import {
  GET_BASIC_INFORMATION_SUCCESS,
  GET_DISTRICT_AND_BERRY_LIST_SUCCESS,
  GET_DISTRICT_AND_COMPANY_LIST_SUCCESS,
  GET_COMPANY_AND_RANCH_LIST_SUCCESS
} from "../constants";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_BASIC_INFORMATION_SUCCESS:
      return {
        ...state,
        personaTypes: action.payload.Persona,
        countryList: action.payload.Countries
      };

    case GET_DISTRICT_AND_BERRY_LIST_SUCCESS:
      return {
        ...state,
        districtAndBerryList: action.payload
      };

    case GET_DISTRICT_AND_COMPANY_LIST_SUCCESS:
      return {
        ...state,
        districtAndCompanyList: action.payload
      };

    case GET_COMPANY_AND_RANCH_LIST_SUCCESS:
      return {
        ...state,
        companyAndRanchList: action.payload
      };

    default:
      return state;
  }
};
