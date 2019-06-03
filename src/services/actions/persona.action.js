import { apis } from "../api";
import {
  GET_BASIC_INFORMATION_SUCCESS,
  GET_DISTRICT_AND_BERRY_LIST_SUCCESS,
  GET_DISTRICT_AND_COMPANY_LIST_SUCCESS,
  GET_COMPANY_AND_RANCH_LIST_SUCCESS
} from "../constants";

export const getBasicInformation = data => {
  return dispatch => {
    apis.getBasicInformation(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
      }
      if (response && !response.errorCode) {
        dispatch({
          type: GET_BASIC_INFORMATION_SUCCESS,
          payload: response
        });
      }
    });
  };
};

export const getDistrictAndBerryList = data => {
  return dispatch => {
    apis.getDistrictAndBerryList(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
      }
      if (response && !response.errorCode) {
        let updatedResponse = response.map(district => {
          district.childListLabel = "BerriesAssigned";
          district.parentListLabel = "DistrictsAssigned";
          district.label = district.DistrictName;
          district.value = district.DistrictName;

          if (district.BerriesAssigned) {
            let updatedBerries = district.BerriesAssigned.map(berry => {
              berry.label = berry.Name;
              berry.value = berry.Name;
              return berry;
            });
            district.secondaryAssignments = updatedBerries;
            delete district.BerriesAssigned;
          }
          return district;
        });
        dispatch({
          type: GET_DISTRICT_AND_BERRY_LIST_SUCCESS,
          payload: updatedResponse
        });
      }
    });
  };
};

export const getDistrictAndBerryListByUser = (data, callback) => {
  return dispatch => {
    apis.getDistrictAndBerryList(data, dispatch, (err, response) => {
      if (err) {
        callback(err);
        console.log(err);
      }
      if (response && !response.errorCode) {
        callback(response);
      }
    });
  };
};

export const getDistrictAndCompanyListByUser = (data, callback) => {
  return dispatch => {
    apis.getDistrictAndCompanyList(data, dispatch, (err, response) => {
      if (err) {
        callback(err);
        console.log(err);
      }
      if (response && !response.errorCode) {
        callback(response);
      }
    });
  };
};

export const getCompanyAndRanchListByUser = (data, callback) => {
  return dispatch => {
    apis.getCompanyAndRanchList(data, dispatch, (err, response) => {
      if (err) {
        callback(err);
        console.log(err);
      }
      if (response && !response.errorCode) {
        callback(response);
      }
    });
  };
};

export const getCompanyAndRanchPlannerListByUser = (data, callback) =>{
  return dispatch => {
    apis.getDistrictAndCompanyList(data, dispatch, (err, response) => {
      if (err) {
        callback(err);
        console.log(err);
      }
      if (response && !response.errorCode) {
        callback(response);
      }
    });
  };
}

export const getDistrictAndCompanyList = data => {
  return dispatch => {
    apis.getDistrictAndCompanyList(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
      }
      if (response && !response.errorCode) {
        let updatedResponse = response.map(district => {
          district.childListLabel = "Companies";
          district.parentListLabel = "DistrictsAssigned";
          district.label = district.DistrictName;
          district.value = district.DistrictName;
          if (district.Companies) {
            let updatedCompanies = district.Companies.map(company => {
              company.label = company.Name + " - " + company.Code;
              company.value = company.Name + " - " + company.Code;
              return company;
            });
            district.secondaryAssignments = updatedCompanies;
            delete district.Companies;
          }
          return district;
        });
        dispatch({
          type: GET_DISTRICT_AND_COMPANY_LIST_SUCCESS,
          payload: updatedResponse
        });
      }
    });
  };
};

export const getCompanyAndRanchList = data => {
  return dispatch => {
    apis.getCompanyAndRanchList(data, dispatch, (err, response) => {
      if (err) {
        console.log(err);
      }
      if (response && !response.errorCode) {
        let updatedResponse = response.map(company => {
          company.childListLabel = "Ranches";
          company.parentListLabel = "CompainesAssigned";
          company.label = company.CompanyName + " - " + company.CompanyNumber;
          company.value = company.CompanyName + " - " + company.CompanyNumber;
          if (company.Ranches) {
            let updatedRanches = company.Ranches.map(ranch => {
              ranch.label = ranch.Name + " - " + ranch.Code;
              ranch.value = ranch.Name + " - " + ranch.Code;
              return ranch;
            });
            company.secondaryAssignments = updatedRanches;
            delete company.Ranches;
          }
          return company;
        });
        dispatch({
          type: GET_COMPANY_AND_RANCH_LIST_SUCCESS,
          payload: updatedResponse
        });
      }
    });
  };
};
