import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import configureStore from "./store";
import Home from "./src/scene/Home";
import Login from "./src/login/scene/Login";

import authWrapper from "./src/login/components/auth-wrapper";
import { USER_AUTH_SUCCESS } from "./src/services/constants";
import English from "./src/login/config/language/english";
import Spanish from "./src/login/config/language/spanish";

const store = configureStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FDDA24"
    },
    secondary: {
      main: "#4A773C",
      contrastText: "#fff"
    },
    other: {
      main: "#6F5091"
    }
  },
  overrides: {
    MuiButton: {
      raisedPrimary: {
        color: "#4A773C"
      },
      raisedSecondary: {
        color: "#fff"
      }
    },
    MuiTooltip: {
      tooltip: {
        fontSize: "0.875rem"
      }
    }
  },
  typography: {
    fontFamily: "Rubik"
  },
  fontFamily: "Rubik"
});

// check for presence of user
if (localStorage.getItem("user")) {
  const user = JSON.parse(localStorage.getItem("user"));
  store.dispatch({
    type: USER_AUTH_SUCCESS,
    payload: user
  });
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <MuiThemeProvider theme={theme}>
        <Switch>
          <Route path="/home" component={authWrapper(Home)} />
          <Route path="/" exact component={Login} />
        </Switch>
      </MuiThemeProvider>
    </Router>
  </Provider>,
  document.getElementById("root")
);
