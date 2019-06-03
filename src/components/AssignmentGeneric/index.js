import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { IconButton, Grid, Typography, Divider } from "@material-ui/core";
import { AddCircleTwoTone, FormatListBulleted } from "@material-ui/icons";

import AssignmentTree from "../AssignmentTree";
import SingleSelect from "../SingleSelect";
import MultiSelect from "../MultiSelect";
import DialogBox from "../DialogBox";

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: "1rem 0 1rem 0",
    paddingTop: "1.5rem"
  },
  containerMain: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1
  },
  rowTitle: {
    marginTop: "1rem"
  },
  iconButton: {
    width: "4rem",
    height: "4rem",
    marginLeft: "2rem"
  },
  assignment: {
    display: "flex",
    flexWrap: "wrap"
  },
  singleSelect: {
    width: "25%",
    margin: "0 1rem"
  },
  multiSelect: {
    width: "40%",
    margin: "0 1rem"
  },
  divider: {
    margin: "2rem 0 1rem 0"
  }
});

class AssignmentGeneric extends Component {
  state = {
    valueParent: null,
    valueChild: [],
    assignments: [],
    assignmentList: [],
    assignedItemsList: [],
    showDialog: false,
    shouldDeleteAssignment: false,
    parentItemToDelete: null,
    assignmentNotificationMessage: null
  };

  componentDidMount() {
    const { data, assignmentList } = this.props;
    if (data) {
      this.setState({
        assignments: data
      });
    }
    this.setState({ assignmentList });
  }

  /**
   * * updates <AssignmentGeneric> state with <SingleSelect> / <MultiSelect/> value on change.
   */
  handleParentChange = value => {
    this.setState({ valueParent: value, valueChild: [] });
  };

  handleChildChange = value => {
    this.setState({ valueChild: value });
  };

  /**
   * * updates assignments list on add.
   */
  handleAssign = () => {
    const { selectedPersona, updateAssignment } = this.props;
    const {
      valueParent,
      valueChild,
      assignments,
      assignmentList,
      assignedItemsList
    } = this.state;
    if (valueParent && valueChild.length) {
      const filteredList = assignmentList.filter(
        item => item.value !== valueParent.value
      );
      let parentItem = JSON.parse(JSON.stringify(valueParent));
      assignedItemsList.push(parentItem);

      valueParent.secondaryAssignments = valueChild;
      assignments.push(valueParent);

      this.setState({
        assignments: assignments,
        valueParent: null,
        valueChild: [],
        assignmentList: filteredList,
        assignedItemsList
      });
    } else if (valueChild && selectedPersona === "Regional Admin") {
      let newAssignmentList = JSON.parse(JSON.stringify(assignmentList));

      valueChild.map(assignment => {
        assignedItemsList.push(assignment);
        newAssignmentList = newAssignmentList.filter(
          item => item.value !== assignment.value
        );
        assignment.secondaryAssignments = [];
        assignments.push(assignment);
      });

      this.setState({
        assignments: assignments,
        assignmentList: newAssignmentList,
        valueChild: [],
        valueParent: null
      });
    }
    updateAssignment(assignments);
  };

  /**
   * * Callback from <AssignmentTree> to delete parent / child assignment item.
   */
  handleParentDelete = assignmentData => {
    let {
      assignments,
      assignmentList,
      assignedItemsList,
      showDialog
    } = this.state;
    const { updateAssignment } = this.props;
    const notificationMessage = this.getAssignmentNotificationMessage("parent");

    assignments = assignments.filter(
      assignment => assignment.value !== assignmentData.value
    );
    if (!assignments.length && !showDialog) {
      this.setState({
        showDialog: true,
        parentItemToDelete: assignmentData,
        assignmentNotificationMessage: notificationMessage
      });
      return;
    }
    let newAssignmentList = JSON.parse(JSON.stringify(assignmentList));
    assignedItemsList.map(assignment => {
      if (assignment.value === assignmentData.value)
        newAssignmentList.push(assignment);
    });

    assignedItemsList = assignedItemsList.filter(
      assignment => assignment.value !== assignmentData.value
    );

    newAssignmentList = newAssignmentList.sort(function(a, b) {
      var districtA = a.DistrictName,
        districtB = b.DistrictName,
        companyA = a.CompanyName,
        companyB = b.CompanyName;
      if (districtA < districtB)
        //sort districts list for Super Admin and Regional Admin
        return -1;
      if (companyA && companyB && companyA < companyB)
        //sort company list for Ranch Admin
        return -1;
    });

    this.setState({
      assignments,
      assignmentList: newAssignmentList,
      assignedItemsList,
      valueParent: null,
      showDialog: false,
      parentItemToDelete: null
    });
    updateAssignment(assignments);
  };

  handleChildDelete = (childKey, parentItem) => {
    const { updateAssignment } = this.props;
    let { assignments } = this.state;
    let isChildListEmpty = false;
    const notificationMessage = this.getAssignmentNotificationMessage("child");
    assignments = assignments.map(assignment => {
      const parent = assignment.value;
      if (parent === parentItem.value) {
        let filteredChild = assignment.secondaryAssignments.filter(
          child => child.value !== childKey
        );
        if (filteredChild.length === 0) {
          this.setState({
            showDialog: true,
            parentItemToDelete: parentItem,
            assignmentNotificationMessage: notificationMessage
          });
          isChildListEmpty = true;
        } else {
          assignment.secondaryAssignments = filteredChild;
        }
      }
      return assignment;
    });
    if (!isChildListEmpty) {
      this.setState({ assignments });
      updateAssignment(assignments);
    }
  };

  /**
   * @returns assignment dropdowns conditionally.
   */
  getAssigmentForm = () => {
    const { valueParent, assignmentList, valueChild } = this.state;
    const {
      classes,
      selectedPersona,
      accessibleFeatures,
      languageMap
    } = this.props;

    const optionsChild =
      selectedPersona === "Regional Admin"
        ? assignmentList
        : valueParent && valueParent.secondaryAssignments;
    return (
      <div className={classes.containerMain}>
        {selectedPersona !== "Regional Admin" && (
          <div className={classes.singleSelect}>
            <SingleSelect
              onChange={this.handleParentChange}
              options={assignmentList}
              placeholder={languageMap[accessibleFeatures.placeholderParent]}
              value={valueParent}
            />
          </div>
        )}
        {(valueParent || selectedPersona === "Regional Admin") && (
          <div className={classes.multiSelect}>
            <MultiSelect
              onChange={this.handleChildChange}
              options={optionsChild}
              placeholder={
                accessibleFeatures !== undefined &&
                languageMap[accessibleFeatures.placeholderChild]
              }
              value={valueChild}
            />
          </div>
        )}
        {(valueParent || selectedPersona === "Regional Admin") && (
          <div>
            <IconButton
              color="inherit"
              onClick={this.handleAssign}
              className={classes.iconButton}
            >
              <AddCircleTwoTone className={classes.icon} />
              <Typography style={{ marginLeft: "5px" }}>ADD</Typography>
            </IconButton>
          </div>
        )}
      </div>
    );
  };

  /**
   * @returns Assignment tree.
   */
  getAssigmentTree = () => {
    const { assignments } = this.state;
    const {
      classes,
      mode,
      selectedPersona,
      existingAssignmentData
    } = this.props;
    let existingAssignmentDataStep =
      existingAssignmentData && existingAssignmentData.split(", ");
    const assignmentsStep =
      existingAssignmentDataStep !== undefined &&
      existingAssignmentDataStep.length > 0
        ? [...existingAssignmentDataStep, ...assignments]
        : assignments;
    return (
      <div className={classes.assignment}>
        {assignmentsStep &&
          assignmentsStep.map((assignment, idx) => (
            <AssignmentTree
              key={idx}
              handleParentDelete={this.handleParentDelete}
              handleChildDelete={this.handleChildDelete}
              assignmentData={assignment}
              mode={mode}
              personaType={selectedPersona}
            />
          ))}
      </div>
    );
  };

  /**
   * * Function to control Dialog Box.
   */
  handleDialogClose = () => {
    this.setState({
      showDialog: false
    });
  };

  getAssignmentNotificationMessage = level => {
    const { selectedPersona, languageMap } = this.props;

    switch (selectedPersona) {
      case "Regional Admin":
        return languageMap.deleteDistrict;

      case "Ranch Admin":
        return level == "child"
          ? languageMap.deleteCompanyAssignment
          : languageMap.deleteDistrict;

      case "Harvest Planner":
        return level == "child"
          ? languageMap.deleteBerryAssignment
          : languageMap.deleteDistrict;

      case "Ranch Planner":
        return level == "child"
          ? languageMap.deleteRanchAssignment
          : languageMap.deleteCompany;

      default:
        return "Are you sure you want to delete?";
    }
  };

  render() {
    const {
      classes,
      accessibleFeatures,
      mode,
      registerAssignMessage,
      languageMap
    } = this.props;
    const {
      showDialog,
      parentItemToDelete,
      assignmentNotificationMessage
    } = this.state;
    const assignmentTree = this.getAssigmentTree();
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item sm={3} className={classes.rowTitle}>
            {accessibleFeatures !== undefined && (
              <Typography variant="subtitle1" gutterBottom>
                {mode === "view"
                  ? languageMap[registerAssignMessage]
                  : languageMap[accessibleFeatures.assignmentMessage]}
              </Typography>
            )}
          </Grid>

          <Grid item sm={9}>
            {mode === "view" ? "" : this.getAssigmentForm()}
            {assignmentTree}
          </Grid>
        </Grid>
        <DialogBox
          modalMessage={assignmentNotificationMessage}
          modalTitle={""}
          open={showDialog}
          handleClose={this.handleDialogClose}
          onClickYes={() => this.handleParentDelete(parentItemToDelete)}
          onClickNo={this.handleDialogClose}
        />
        <Divider className={classes.divider} />
      </div>
    );
  }
}

AssignmentGeneric.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AssignmentGeneric);
