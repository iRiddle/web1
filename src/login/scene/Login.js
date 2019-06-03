import React, { Component } from "react";
import OktaSignIn from "@okta/okta-signin-widget";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./login.css";
import config from "../config";
import Logo from "../../../assets/images/logo-vector.svg";
import { login } from "../../services/actions/auth.action";
import { getUserDetails } from "../../services/actions/user.action";
import packageJson from "../../../package.json";
import English from "../../login/config/language/english";
import Spanish from "../../login/config/language/spanish";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
    this.widget = new OktaSignIn({
      baseUrl: config.okta.baseUrl,
      logo: Logo,
      clientId: config.okta.clientId,
      redirectUri: config.okta.redirectUri,
      authParams: {
        issuer: "default",
        responseType: "id_token"
      }
    });
  }

  componentDidMount = () => {
    let _this = this;
    this.widget.session.get(response => {
      if (response.status !== "INACTIVE" && this.props.user) {
        _this.setState({ user: response });
        _this.props.login(response);
      } else {
        _this.showLogin();
      }
    });
    if (this.state.user) {
      this.props.login(this.state.user);
    }
  };

  showLogin = () => {
    let _this = this;
    Backbone.history.stop();
    this.widget.renderEl(
      { el: _this.loginContainer },
      response => {
        const email = response.claims.email;
        // Check user details (preferredLanguage)
        _this.props.getUserDetails({ login: email }, (res) => {
          let preferredLang = res.profile.preferredLanguage;
          // Save user language map based on preferredLanguage
          const userLang = preferredLang === "en" ? English : Spanish;
          localStorage.setItem("preferredLanguage", preferredLang);
          localStorage.setItem("languageMap", JSON.stringify(userLang));

          _this.setState({ user: response.claims });
          _this.props.login(response.claims);
        });
      },
      err => {
        console.log(err);
      }
    );
  };

  logout = () => {
    this.widget.signOut(() => {
      this.setState({ user: null });
      this.showLogin();
    });
  };

  render() {
    const { user } = this.state;
    return (
      <div className="login-container">
        {user ? null : (
          <div
            ref={div => {
              this.loginContainer = div;
            }}
          />
        )}
        <div
          style={{
            flex: 1,
            position: "fixed",
            bottom: "0",
            right: "0",
            color: "#4a773c",
            marginRight: "1rem",
            marginBottom: "1rem"
          }}
        >
          rev. {packageJson.version}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ login, getUserDetails }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
