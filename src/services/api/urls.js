//Base URL for OKTA apis
const oktaBaseUrl = "https://devtstdriscolls.oktapreview.com/api/v1/";
const oktaBackendBaseUrl = process.env.OKTA_BACKEND_URI;
// const muleBaseUrl = 
// "https://tst-api.usw.driscolls.com/growerweb/api/v1/users";
const muleBaseUrl = 
 "https://dev-api.usw.driscolls.com/growerweb/api/v1/users";

//OKTA APIs
export const createOktaUserUrl = `${oktaBaseUrl}users?activate=false`;
export const updateOktaUserUrl = `${muleBaseUrl}/`;
export const getUserDetails = `${oktaBackendBaseUrl}/users/getUserDetails`;
export const getUserDetailsList = `${oktaBackendBaseUrl}/users/getUserDetailsList`;
export const assignUserToApp = `${oktaBackendBaseUrl}/users/assignUserToGpaWeb`;
export const updateUser = `${oktaBackendBaseUrl}/users/updateUser`;
export const sendActivationMail = `${oktaBackendBaseUrl}/users/sendActivationMail`;
export const sendMassAlertsUrl = `${oktaBackendBaseUrl}/users/massalerts`;
export const getUserDetail = `${oktaBaseUrl}users/`;

//Mule RDS APIs
export const basicInformation = `${muleBaseUrl}/basicinformation`;
export const districtAndBerryList = `${muleBaseUrl}/districts`;
export const companyAndRanchList = `${muleBaseUrl}/ranches`;
export const districtAndCompanyList = `${muleBaseUrl}/companies`;
export const inviteUser = `${muleBaseUrl}/`;
export const associatedUsersList = `${muleBaseUrl}/manage`;
export const getRemindersList = `${muleBaseUrl}/configurations?configkey=REMAINDERTIME`;
export const updateReminder = `${muleBaseUrl}/configurations`;
export const getMassAlertDistrictList = `${muleBaseUrl}/massalerts`;
export const getMassAlertRanchList = `${muleBaseUrl}/massalerts/ranches`;
export const postMassAlert = `${muleBaseUrl}/massalerts`;
