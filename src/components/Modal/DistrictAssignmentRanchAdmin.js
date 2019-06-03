import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Typography, Paper } from "@material-ui/core";
import { DeleteOutline, AddCircleTwoTone } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import MultiSelect from "../MultiSelect";
import SingleSelect from "../SingleSelect";

const isEmpty = require("lodash/isEmpty");
const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    boxShadow: "none"
  },
  icon: {
    fontSize: "1.5rem",
    color: "#2989FE",
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
    margin: "0 10px 10px 0",
    flexDirection: "column",
    backgroundColor: "#F7FAFD",
    padding: "1rem",
    maxWidth: "fit-content",
    maxHeight: "fit-content",
    borderRadius: "0.5rem"
  },
  crossIcon: {
    fontSize: "0.65rem",
    marginRight: "1.7rem",
    marginLeft: "0.5rem",
    cursor: "pointer",
    color: "#C3C3C3"
  },
  headerAssign: {
    marginBottom: "1rem"
  },
  edit_popup_district_root: {
    display: "flex",
    flexDirection: "column"
  },
  childContainer_body: {
    display: "flex",
    flexDirection: "row"
  },
  edit_popup_district_root_element: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "1rem"
  }
});

class DistrictAssignmentRanchPlanner extends Component {
  getChildComponent = (companies, parrentId) => {
    const { mode, classes } = this.props;
    return (
      <div className={classes.edit_popup_district_root}>
        {companies.map(
          company =>
            company.TransactionStatus !== "I" && (
              <div
                key={company.Id}
                className={classes.edit_popup_district_root_element}
              >
                {mode !== "view" && (
                  <Typography
                    onClick={() =>
                      this.handleAssignmentDelete(company.Id, parrentId)
                    }
                    className={classes.crossIcon}
                  >
                    {`X    `}
                  </Typography>
                )}
                <Typography key={company.Id}>{company.Name}</Typography>
              </div>
            )
        )}
      </div>
    );
  };

  handleAssignmentDelete = (assignmentId, parrentId) => {
    const { districts, updateDistricts  } = this.props;
    let districtsStep = [];
    if (parrentId) {
      districtsStep = districts.map(district => {
        if (district.DistrictId === parrentId) {
          return {
            ...district,
            Companies: district.Companies.map(company => {
              if (company.Id === assignmentId) {
                return { ...company, TransactionStatus: "I" };
              }
              return { ...company };
            })
          };
        }
        return { ...district };
      });

      const getCurrentRanch = districtsStep.filter(
        district => district.DistrictId === parrentId
      );

      const checkIfCompaniesNull = getCurrentRanch[0].Companies.every(
        ranch => ranch.TransactionStatus === "I"
      );

      if (checkIfCompaniesNull) {
        return this.handleAssignmentDelete(parrentId);
      }
      updateDistricts(districtsStep);
    } else {
      districtsStep = districts.map(district => {
        if (district.DistrictId === assignmentId) {
          // const deletedDistrict = stepDistricts.filter(district => district.DistrictId === assignmentId)
          // handleAddToAllDistrict(deletedDistrict[0])
          return {
            TransactionStatus: "I",
            ...district
          };
        }
        return { ...district };
      });
      updateDistricts(districtsStep);
    }
  };

  addAssignment = () => {
    const {
      districts,
      selectedAssignmentHarvestPlanner,
      selectedAssignment,
      updateDistricts
    } = this.props;

    let sortedDistricts = "";
    if (selectedAssignmentHarvestPlanner) {
      sortedDistricts = districts.some(
        district =>
          district.DistrictId === selectedAssignmentHarvestPlanner.DistrictId
      );
      if (!sortedDistricts) {
        delete selectedAssignmentHarvestPlanner.id;
        delete selectedAssignmentHarvestPlanner.value;
        delete selectedAssignmentHarvestPlanner.label;
        updateDistricts(
          [
            ...districts,
            {
              ...selectedAssignmentHarvestPlanner,
              Companies: [...selectedAssignment]
            }
          ],
          [],
          null
        );
      } else {
        sortedDistricts = districts.map(obj => {
          if (obj.DistrictId === selectedAssignmentHarvestPlanner.DistrictId) {
            delete obj.TransactionStatus;
            return {
              ...obj,
              Companies: [...selectedAssignment]
            };
          } else return obj;
        });
        updateDistricts(sortedDistricts, [], null);
      }
    }
  };

  render() {
    const {
      classes,
      districts,
      persona,
      handleAssignmentChange,
      selectedAssignmentHarvestPlanner,
      selectedAssignment,
      allDistricts
    } = this.props;
    return (
      <div className={classes.edit_popup__personal_information}>
        <Grid container spacing={24}>
          <Grid item xl={3} lg={4} md={4}>
            <SingleSelect
              options={allDistricts}
              persona={persona}
              onChange={handleAssignmentChange}
              placeholder="Select District"
            />
          </Grid>
          {!isEmpty(selectedAssignmentHarvestPlanner) && (
            <>
              <Grid item xl={3} lg={4} md={4}>
                <MultiSelect
                  persona={persona}
                  value={selectedAssignment}
                  options={selectedAssignmentHarvestPlanner.Companies}
                  onChange={handleAssignmentChange}
                  placeholder="Select Districts"
                />
              </Grid>
              <Grid item xl={3} lg={4} md={4}>
                <IconButton
                  color="inherit"
                  onClick={this.addAssignment}
                  className={classes.iconButton}
                >
                  <AddCircleTwoTone className={classes.icon} />
                  <Typography style={{ marginLeft: "5px" }}>ADD</Typography>
                </IconButton>
              </Grid>
            </>
          )}
          <Grid item xl={12} lg={12} md={12}>
            <Paper className={classes.root}>
              {districts.map(
                district =>
                  district.TransactionStatus !== "I" && (
                    <div
                      className={classes.childContainer}
                      key={district.DistrictId}
                    >
                      <div className={classes.childContainer_body}>
                        {persona !== "view" && (
                          <DeleteOutline
                            className={classes.icon}
                            onClick={() => {
                              this.handleAssignmentDelete(district.DistrictId);
                            }}
                          />
                        )}
                        <Typography className={classes.headerAssign}>
                          {district.DistrictName}
                        </Typography>
                      </div>
                      {this.getChildComponent(
                        district.Companies,
                        district.DistrictId
                      )}
                    </div>
                  )
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(DistrictAssignmentRanchPlanner);
