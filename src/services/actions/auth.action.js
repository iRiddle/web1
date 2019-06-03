import history from "../../utils/history";
import { USER_LOGOUT_REQUEST, USER_AUTH_SUCCESS } from "../constants";

export const logout = () => {
  return dispatch => {
    dispatch({
      type: USER_LOGOUT_REQUEST
    });
    localStorage.clear();
    history.push("/");
  };
};

export const login = data => {
  return dispatch => {
    dispatch({
      type: USER_AUTH_SUCCESS,
      payload: data
    });
    localStorage.setItem("user", JSON.stringify(data));
    history.push("/home");
  };
};
