import axios from "axios";
import queryString from "querystring";

import history from "../../utils/history";
import { okta } from "../../login/config";

const catchfunction = (err, dispatch, callback, errorCallback) => {
  if (!err.response) {
    console.log(err);
    return;
  }

  switch (err.response.status) {
    case 401: //unauthorised
    case 403: //forbidden
      history.push("/404");
    case 400: //bad request
    case 500: //server error
      console.log(err);
      break;
    case 200:
    case 201:
    case 304:
    default:
      callback(err.response.data);
      break;
  }
  if (errorCallback) {
    errorCallback(err.response.data);
  }
};

export default function makeCall(params, dispatch, callback, errorCallback) {
  let parameters = { ...params };
  if (typeof parameters.url != "string") {
    let url = parameters.url.path;
    let pathParams = Object.keys(parameters.url.param);
    for (let param of pathParams) {
      let exp = new RegExp("(:" + param + "\\b)");
      url = url.replace(exp, parameters.url.param[param]);
    }
    parameters.url = url;
  }
  parameters.headers = parameters.headers || {};

  if (
    parameters.method == "GET" &&
    queryString.stringify(parameters.data).length
  ) {
    parameters.url += `?${queryString.stringify(parameters.data)}`;
  }

  if (parameters.server === "OKTA") {
    parameters.headers["Accept"] = "application/json";
    parameters.headers["Content-Type"] = "application/json";
    parameters.headers["Authorization"] = `SSWS ${okta.apiToken}`;
  }

  if(parameters.server !== "OKTA") {
    parameters.headers["Content-Type"] = "application/json";
    parameters.headers["Authorization"] = "Basic MG9hOXBhZTBmeUh4TUdlUWQzNTY6bEo4WWh2OWJUUnhTYzU2VTR6UElTSUpzTS1rc3R0TkZwWjVfU2lmcg==";
  }


  axios(parameters)
    .then(response => {
      callback(null, response.data);
    })
    .catch(error => {
      console.log(error);
      catchfunction(error, dispatch, callback, errorCallback);
      callback(error);
    });
}
