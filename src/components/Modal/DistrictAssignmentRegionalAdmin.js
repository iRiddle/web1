import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { IconButton } from "@material-ui/core";
import { AddCircleTwoTone } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import MultiSelect from "../MultiSelect";
class DistrictAssignmentRegionalAdmin extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.districts.length !== nextProps.districts.length ||
      this.props.selectedAssignment !== nextProps.selectedAssignment ||
      this.props.allDistricts.length !== nextProps.allDistricts
    ) {
      return true;
    }
    return false;
  }
  handleAssignmentDelete = assignmentId => {
    const { districts, handleAddToAllDistrict } = this.props;
    let districtsStep = [];
    districtsStep = districts.map(district => {
      if (district.DistrictId === assignmentId) {
        handleAddToAllDistrict(district)
        return {
          TransactionStatus: "I",
          ...district
        };
      } else {
        return district;
      }
    });

    this.props.updateDistricts(districtsStep, []);
  };

  addAssignment = () => {
    const { districts, selectedAssignment, deleteFromAllDistricts } = this.props;
    // const sortedDistricts = selectedAssignment.filter(obj => {
    //   return !districts.some(obj2 => {
    //     return obj.DistrictId === obj2.DistrictId;
    //   });
    // });
    // sortedDistricts.forEach(v => {
    //   delete v.id;
    //   delete v.value;
    //   delete v.label;
    // });

    deleteFromAllDistricts(selectedAssignment)
    this.props.updateDistricts([...districts, ...selectedAssignment], []);
  };

  render() {
    const {
      classes,
      districts,
      allDistricts,
      persona,
      handleAssignmentChange,
      selectedAssignment
    } = this.props;

    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xl={3} lg={3} md={3}>
            <MultiSelect
              persona={persona}
              value={selectedAssignment}
              options={allDistricts}
              onChange={handleAssignmentChange}
              placeholder="Select District"
              label="Assign Districts"
            />
          </Grid>
          <Grid item xl={3} lg={3} md={3}>
            <div>
              <IconButton
                color="inherit"
                onClick={this.addAssignment}
                className={classes.iconButton}
              >
                <AddCircleTwoTone className={classes.icon} />
                <Typography style={{ marginLeft: "5px" }}>ADD</Typography>
              </IconButton>
            </div>
          </Grid>
          <Grid item xl={12} lg={12} md={12}>
            <div className={classes.edit_popup_district_root}>
              {districts.map(
                i =>
                  i.TransactionStatus !== "I" && (
                    <div
                      key={i.DistrictId}
                      className={classes.edit_popup_district_root_element}
                    >
                      {persona !== "view" && ( //change this
                        <Typography
                          onClick={() =>
                            this.handleAssignmentDelete(i.DistrictId)
                          }
                          className={classes.crossIcon}
                        >
                          {`X    `}
                        </Typography>
                      )}
                      <Typography key={i.DistrictId}>
                        {i.DistrictName}
                      </Typography>
                    </div>
                  )
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default DistrictAssignmentRegionalAdmin;
