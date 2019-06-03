import React from "react";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    display: "flex",
    justifyContents: "space-between",
    alignItems: "flex-start",
    flexDirection: "column",
    flexGrow: 1,
    paddingTop: "1rem",
    paddingBottom: "1rem",
    maxWidth: "fit-content",
    margin: "2rem 2rem 0 1rem",
    boxShadow: "none",
    borderRadius: "0.5rem",
    backgroundColor: "#F7FAFD"
  },
  icon: {
    fontSize: "1.5rem",
    color: "#ec4324d6",
    marginRight: "1rem",
    cursor: "pointer"
  },
  company: {
    display: "flex",
    flexDirection: "column"
  },
  headerAssign: {
    fontSize: "1rem",
    fontWeight: "bold"
  },
  itemsAssign: {
    marginBottom: "0.3rem"
  },
  childContainer: {
    display: "flex",
    alignItems: "center",
    paddingBottom: "0.5rem"
  },
  crossIcon: {
    fontSize: "0.65rem",
    marginRight: "1.7rem",
    marginLeft: "0.5rem",
    cursor: "pointer",
    color: "rgb(236, 18, 18)"
  }
});

class AssignmentTree extends React.Component {
  /**
   * @returns second level tree.
   */
  getAssignmentTree = assignmentData => {
    const { classes, mode } = this.props;

    return assignmentData.secondaryAssignments.map(assignment => {
      return (
        <div key={assignment.value} className={classes.childContainer}>
          {mode !== "view" && (
            <Typography
              onClick={() => {
                this.handleChildDelete(assignment.value, assignmentData);
              }}
              className={classes.crossIcon}
            >
              {`X    `}
            </Typography>
          )}
          <Typography key={assignment.value}>{assignment.label}</Typography>
        </div>
      );
    });
  };

  /**
   * callback to <AssignmentGeneric> to delete a whole assignment.
   */

  handleParentDelete = assignmentData => {
    const { handleParentDelete } = this.props;
    handleParentDelete(assignmentData);
  };

  /**
   * callback to <AssignmentGeneric> to delete a sub assignment.
   */

  handleChildDelete = (childKey, parentItem) => {
    const { handleChildDelete } = this.props;
    handleChildDelete(childKey, parentItem);
  };

  render() {
    const { classes, assignmentData, mode } = this.props;
    return (
      <Paper className={classes.root}>
        <div className={classes.childContainer}>
          {mode !== "view" && (
            <DeleteOutline
              className={classes.icon}
              onClick={() => {
                this.handleParentDelete(assignmentData);
              }}
            />
          )}
          <Typography className={classes.headerAssign}>
            {assignmentData.value || assignmentData}
          </Typography>
        </div>

        {/**@returns secondary assignment tree if exists. */}

        {assignmentData.secondaryAssignments &&
          this.getAssignmentTree(assignmentData)}
      </Paper>
    );
  }
}

AssignmentTree.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AssignmentTree);
