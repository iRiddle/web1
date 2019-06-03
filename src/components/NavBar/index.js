import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import { PersonOutline } from "@material-ui/icons";

import { logout } from "../../services/actions/auth.action";
import Logo from "../../../assets/images/logo-vector.svg";

// const languageMap = JSON.parse(localStorage.getItem("languageMap"));

const styles = theme => ({
  root: {
    width: "100%"
  },
  title: {
    flexGrow: 1,
    marginLeft: 20,
    letterSpacing: "1px"
  },
  appBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "80px",
    paddingLeft: "30px",
    paddingRight: "20px"
  },
  icon: {
    fontSize: "3rem"
  },
  sectionDesktop: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  }
});

class NavBar extends React.Component {
  state = {
    anchorEl: null
  };

  /**
   * * Display menu items on click of user icon.
   */
  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  /**
   * * Closes menu
   */
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  /**
   * * Logout user and redirect to login screen
   */
  handleLogout = () => {
    localStorage.clear();
    this.props.logout();
    this.handleClose();
  };

  handleViewProfile = () => {
    this.props.handleViewProfile();
    this.handleClose();
  };

  render() {
    const {
      classes,
      theme,
      userProfile,
      handleViewProfile,
      showHome,
      languageMap
    } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar theme={theme} className={classes.appBar}>
          <img
            onClick={showHome}
            src={Logo}
            style={{ height: "162px", cursor: "pointer" }}
          />
          <Typography
            className={classes.title}
            variant="h6"
            color="secondary"
            noWrap
          >
            {languageMap.growerPortal}
          </Typography>

          <div className={classes.sectionDesktop}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: ""
              }}
            >
              <Typography color="secondary" variant="subtitle1">
                {`${userProfile.firstName} ${userProfile.lastName}`}
              </Typography>
              <Typography color="secondary" variant="subtitle2" gutterBottom>
                {userProfile.persona}
              </Typography>
            </div>
            <IconButton
              color="inherit"
              aria-owns={open ? "menu-appbar" : undefined}
              aria-haspopup="true"
              onClick={this.handleMenu}
            >
              <PersonOutline className={classes.icon} color="secondary" />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={open}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleViewProfile}>
                {languageMap.myProfile}
              </MenuItem>
              <MenuItem onClick={this.handleLogout}>
                {languageMap.logout}
              </MenuItem>
            </Menu>
          </div>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ logout }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(NavBar));
