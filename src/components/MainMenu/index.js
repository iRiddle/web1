import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Tab, Divider } from "@material-ui/core";

const styles = theme => ({
  root: {
    flexGrow: 1,
    position: "fixed",
    backgroundColor: "white",
    width: "95%",
    zIndex: 1,
    margin: "3rem 0% 0 0%"
  },
  navItem: {
    fontSize: "1rem"
  },
  divider: { margin: "6rem 5% 0 0" }
});

// const languageMap = JSON.parse(localStorage.getItem("languageMap"));

class MainMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  /**
   * * Handles menu item change and passes selected index to parent component
   * @param value selected tab index
   */
  handleChange = (event, value) => {
    const { handleMenuItemChange } = this.props;
    handleMenuItemChange(value);
  };

  /**
   * @returns [Tab] returns array of menu item.
   */
  renderMenuItems = () => {
    const { classes, menuItems, languageMap } = this.props;
    return menuItems.map((item, index) => (
      <Tab className={classes.navItem} key={index} label={languageMap[item]} />
    ));
  };

  render() {
    const { classes, value } = this.props;

    return (
      <div className={classes.root} style={{ marginLeft: "5%" }}>
        <Tabs
          value={value}
          className={classes.root}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="secondary"
        >
          {this.renderMenuItems()}
        </Tabs>
        <Divider className={classes.divider} />
      </div>
    );
  }
}

MainMenu.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MainMenu);
