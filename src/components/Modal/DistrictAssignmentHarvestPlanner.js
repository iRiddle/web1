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
    margin: "0 10px 0 0",
    flexDirection: "column",
    backgroundColor: "#F7FAFD",
    padding: "1rem",
    maxWidth: "fit-content",
    borderRadius: "0.5rem"
  },
  crossIcon: {
    fontSize: "0.65rem",
    marginRight: "1.7rem",
    marginLeft: "0.5rem",
    cursor: "pointer",
    color: "rgb(236, 18, 18)"
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

class DistrictAssignmentHarvestPlanner extends Component {
  getChildComponent = (berriesAssigned, parrentId) => {
    const { mode, classes } = this.props;
    return (
      <div className={classes.edit_popup_district_root}>
        {berriesAssigned.map(
          berry =>
            berry.TransactionStatus !== "I" && (
              <div
                key={berry.Id}
                className={classes.edit_popup_district_root_element}
              >
                {mode !== "view" && (
                  <Typography
                    onClick={() =>
                      this.handleAssignmentDelete(berry.Id, parrentId)
                    }
                    className={classes.crossIcon}
                  >
                    {`X    `}
                  </Typography>
                )}
                <Typography key={berry.Id}>{berry.Name}</Typography>
              </div>
            )
        )}
      </div>
    );
  };

  addAssignment = () => {
    // добавить промежуточный массив с айдишниками которые нужно удалить (для сервера)
    const {
      districts,
      selectedAssignmentHarvestPlanner,
      selectedAssignment,
      updateDistricts,
      deleteFromAllDistricts
    } = this.props;
    let sortedDistricts = "";
    if (selectedAssignmentHarvestPlanner) {
      sortedDistricts = districts.some(
        district =>
          district.DistrictId === selectedAssignmentHarvestPlanner.DistrictId
      );
      deleteFromAllDistricts([selectedAssignmentHarvestPlanner])
      if (!sortedDistricts) {
        delete selectedAssignmentHarvestPlanner.id;
        delete selectedAssignmentHarvestPlanner.value;
        delete selectedAssignmentHarvestPlanner.label;
        updateDistricts(
          [
            ...districts,
            {
              ...selectedAssignmentHarvestPlanner,
              BerriesAssigned: [...selectedAssignment]
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
              BerriesAssigned: [...selectedAssignment]
            };
          } else return obj;
        });
        updateDistricts(sortedDistricts, [], null);
      }
    }
  };

  handleAssignmentDelete = (assignmentId, parrentId) => {
    const { districts, updateDistricts, handleAddToAllDistrict, stepDistricts } = this.props;
    let districtsStep = [];
    if (parrentId) {
      districtsStep = districts.map(district => {
        if (district.DistrictId === parrentId) {
          return {
            ...district,
            BerriesAssigned: district.BerriesAssigned.map(berry => {
              if (berry.Id === assignmentId) {
                return { ...berry, TransactionStatus: "I" };
              } else return { ...berry };
            })
          };
        }
        return district;
      });

      const getCurrentBerry = districtsStep.filter(
        district => district.DistrictId === parrentId
      );

      const checkIfBerriesNull = getCurrentBerry[0].BerriesAssigned.every(
        berry => berry.TransactionStatus === "I"
      );

      if (checkIfBerriesNull) {
        return this.handleAssignmentDelete(parrentId);
      }
      updateDistricts(districtsStep);
    } else {
      districtsStep = districts.map(district => {
        if (district.DistrictId === assignmentId) {
          const deletedDistrict = stepDistricts.filter(district => district.DistrictId === assignmentId)
          handleAddToAllDistrict(deletedDistrict[0])
          return {
            TransactionStatus: "I",
            ...district
          };
        } else {
          return district;
        }
      });
      updateDistricts(districtsStep);
    }
  };

  render() {
    const {
      classes,
      districts,
      allDistricts,
      persona,
      handleAssignmentChange,
      selectedAssignmentHarvestPlanner,
      selectedAssignment
    } = this.props;
    return (
      <div className={classes.edit_popup__personal_information}>
        <Grid container spacing={24}>
          <Grid item xl={3} lg={4} md={4}>
            <SingleSelect
              value={selectedAssignmentHarvestPlanner}
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
                  options={selectedAssignmentHarvestPlanner.BerriesAssigned}
                  onChange={handleAssignmentChange}
                  placeholder="Select Berry Types"
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
                        district.BerriesAssigned,
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

export default withStyles(styles)(DistrictAssignmentHarvestPlanner);
