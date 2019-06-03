import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import PersonalInformation from "./PersonalInformation";
import DistrictAssignmentRegionalAdmin from "./DistrictAssignmentRegionalAdmin";
import DistrictAssignmentRanchPlanner from "./DistrictAssignmentRanchPlanner";
import DistrictAssignmentHarvestPlanner from "./DistrictAssignmentHarvestPlanner";
import DistrictAssignmentRanchAdmin from "./DistrictAssignmentRanchAdmin";
import {
  getUserDetails,
  updateUserProfile,
  updateOktaUser
} from "../../services/actions/user.action";
import {
  getDistrictAndBerryListByUser,
  getDistrictAndCompanyListByUser,
  getCompanyAndRanchListByUser,
  getCompanyAndRanchPlannerListByUser
} from "../../services/actions/persona.action";
const isEmpty = require("lodash/isEmpty");

const styles = theme => ({
  edit_popup__personaTypes: {
    display: "flex"
  },
  edit_popup__personal_information: {
    display: "flex",
    padding: "20px 0"
  },

  edit_popup__persona_types: {
    padding: "20px 0"
  },

  edit_popup__district_assignment: {
    padding: "20px 0"
  },

  edit_popup__infoContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    width: "100%"
  },

  edit_popup__infoContainer_data: {
    display: "flex",
    flexDirection: "column"
  },

  edit_popup__actionButtons: {
    textTransform: "uppercase"
  },
  edit_popup__actions: {
    display: "flex",
    justifyContent: "flex-end"
  },
  edit_popup__gropuLanguage: {
    display: "flex",
    flexDirection: "row"
  },
  edit_popup_district_root: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  edit_popup_district_root_element: {
    display: "flex",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    maxWidth: "fit-content",
    margin: "2rem 2rem 0 0",
    padding: "0 16px",
    boxShadow: "none",
    borderRadius: "0.5rem",
    backgroundColor: "#F7FAFD"
  },
  crossIcon: {
    fontSize: "0.65rem",
    marginRight: "1.7rem",
    marginLeft: "0.5rem",
    cursor: "pointer",
    color: "rgb(236, 18, 18)"
  },
  button: {
    margin: theme.spacing.unit,
    fontSize: "1rem"
  }
});

class Modal extends Component {
  state = {
    currentEditUser: {},
    editInfo: {},
    districts: [],
    allDistricts: [],
    selectedAssignment: [],
    stepDistricts: [],
    selectedAssignmentHarvestPlanner: null,
    userStatus: ""
  };

  componentDidMount() {
    const {
      currentEditUser,
      getUserDetails,
      getDistrictAndBerryListByUser,
      getCompanyAndRanchListByUser,
      getCompanyAndRanchPlannerListByUser,
    } = this.props;
    getUserDetails(
      { login: currentEditUser.id },
      res => {
        this.setState({
          editInfo: res.profile,
          userStatus: res.status
        });
      },
      true
    );
    switch (currentEditUser.persona) {
      case "Regional Admin": {
        getDistrictAndBerryListByUser(
          { personaid: 2, useroktaid: currentEditUser.id },
          res => {
            getDistrictAndBerryListByUser(
              { personaid: 1, useroktaid: currentEditUser.id },
              districts => {
                const filteredAllDistricts = districts.filter(district => {
                  return !res.some(el => el.DistrictId === district.DistrictId);
                });
                this.setState({
                  allDistricts: filteredAllDistricts
                });
              }
            );
            this.setState({
              districts: res
            });
          }
        );

        break;
      }
      case "Harvest Planner": {
        getDistrictAndBerryListByUser(
          { personaid: 3, useroktaid: currentEditUser.id },
          res => {
            getDistrictAndBerryListByUser(
              { personaid: 1, useroktaid: currentEditUser.id },
              districts => {
                this.setState({
                  stepDistricts: districts
                })
                const filteredAllDistricts = districts.filter(district => {
                  return !res.some(el => el.DistrictId === district.DistrictId);
                });
                this.setState({
                  allDistricts: filteredAllDistricts
                });
              }
            );
            this.setState({
              districts: res
            });
          }
        );

        break;
      }
      case "Ranch Planner": {
        getCompanyAndRanchListByUser(
          { personaid: 5, useroktaid: currentEditUser.id },
          res => {
            this.setState({
              districts: res.RanchPlannerAssignment,
              allDistricts: res.RanchPlannerAssignment
            });
          }
        );
        break;
      }
      case "Ranch Admin": {
        getCompanyAndRanchPlannerListByUser(
          { personaid: 4, useroktaid: currentEditUser.id },
          res => {
            // const filteredAllDistricts = res.filter(district => {
            //   return !res.some(el => el.DistrictId === district.DistrictId);
            // });
            this.setState({
              districts: res,
              allDistricts: res
            });
          }
        );
        break;
      }
    }
  }
  getExtraInformation = editInfo => {
    const {
      districts,
      allDistricts,
      selectedAssignment,
      selectedAssignmentHarvestPlanner,
      stepDistricts
    } = this.state;
    const { classes } = this.props;
    let extraInformationTitle = "";
    let persona = "";
    switch (editInfo.persona) {
      case "Regional Admin": {
        extraInformationTitle = "District Assignment";
        persona = editInfo.persona;
        break;
      }
      case "Harvest Planner": {
        extraInformationTitle = "Assign Districts And Berry Types";
        persona = editInfo.persona;
        break;
      }
      case "Ranch Planner": {
        extraInformationTitle = "District Assignment";
        persona = editInfo.persona;
        break;
      }
      case "Ranch Admin": {
        extraInformationTitle = "District Assignment";
        persona = editInfo.persona;
        break;
      }
      default:
        break;
    }
    return (
      <Grid container spacing={24}>
        <Grid item xl={1} lg={1} md={1}>
          <Typography
            variant="subtitle2"
            style={{ color: "black", fontWeight: "bold" }}
          >
            {extraInformationTitle}
          </Typography>
        </Grid>
        <Grid item xl={11} lg={11} md={11}>
          {persona === "Regional Admin" && (
            <DistrictAssignmentRegionalAdmin
              currentEditUser={editInfo}
              classes={classes}
              districts={districts}
              allDistricts={allDistricts}
              persona={persona}
              selectedAssignment={selectedAssignment}
              handleAssignmentChange={this.handleAssignmentChange}
              updateDistricts={this.updateDistricts}
              handleAddToAllDistrict={this.handleAddToAllDistrict}
              deleteFromAllDistricts={this.deleteFromAllDistricts}
            />
          )}
          {persona === "Harvest Planner" && (
            <DistrictAssignmentHarvestPlanner
              currentEditUser={editInfo}
              districts={districts}
              allDistricts={allDistricts}
              persona={persona}
              selectedAssignmentHarvestPlanner={
                selectedAssignmentHarvestPlanner
              }
              selectedAssignment={selectedAssignment}
              handleAssignmentChange={this.handleAssignmentChange}
              updateDistricts={this.updateDistricts}
              handleAddToAllDistrict={this.handleAddToAllDistrict}
              deleteFromAllDistricts={this.deleteFromAllDistricts}
              stepDistricts={stepDistricts}
            />
          )}
          {persona === "Ranch Planner" && (
            <DistrictAssignmentRanchPlanner
              currentEditUser={editInfo}
              districts={districts}
              persona={persona}
              allDistricts={allDistricts}
              selectedAssignmentHarvestPlanner={
                selectedAssignmentHarvestPlanner
              }
              selectedAssignment={selectedAssignment}
              handleAssignmentChange={this.handleAssignmentChange}
              updateDistricts={this.updateDistricts}
            />
          )}
          {persona === "Ranch Admin" && (
            <DistrictAssignmentRanchAdmin
              currentEditUser={editInfo}
              districts={districts}
              persona={persona}
              allDistricts={allDistricts}
              selectedAssignmentHarvestPlanner={
                selectedAssignmentHarvestPlanner
              }
              selectedAssignment={selectedAssignment}
              handleAssignmentChange={this.handleAssignmentChange}
              updateDistricts={this.updateDistricts}
            // handleAddToAllDistrict={this.handleAddToAllDistrict}
            // deleteFromAllDistricts={this.deleteFromAllDistricts}
            // stepDistricts ={stepDistricts}
            />
          )}
        </Grid>
      </Grid>
    );
  };

  handleLanguageChange = event => {
    let language = event.target.value;
    this.setState(prevState => ({
      editInfo: {
        ...prevState.editInfo,
        preferredLanguage: language
      }
    }));
  };

  handleNumberChange = (value, phone) => {
    this.setState(prevState => ({
      editInfo: {
        ...prevState.editInfo,
        primaryPhone: phone
      }
    }));
  };
  handleNumberSecondaryChange = (value, phone) => {
    this.setState(prevState => ({
      editInfo: {
        ...prevState.editInfo,
        secondaryPhone: phone
      }
    }));
  };
  handleAddToAllDistrict = (district) => {
    this.setState(prevState => ({
      allDistricts: [district, ...prevState.allDistricts]
    }));
  }

  deleteFromAllDistricts = (districts) => {
    const filteredAllDistricts = this.state.allDistricts.filter(district => {
      return !districts.some(el => el.DistrictId === district.DistrictId);
    });
    this.setState({
      allDistricts: filteredAllDistricts
    })
  }
  handleAssignmentChange = data => {
    if (Array.isArray(data)) {
      this.setState({
        selectedAssignment: data
      });
    } else {
      this.setState({
        selectedAssignmentHarvestPlanner: data
      });
    }
  };

  parseDistrictsRegionalAdminToUpload = districts => {
    return districts.map(district => {
      if (district.TransactionStatus === "I") {
        return { ...district };
      } else return { ...district, TransactionStatus: "A" };
    });
  };

  parseDistrictsHarvestPlannerToUpload = districts => {
    return districts.map(district => {
      if (district.TransactionStatus === "I") {
        return {
          DistrictName: district.DistrictName,
          DistrictId: district.DistrictId,
          DistrictCode: district.DistrictCode,
          BerriesAssigned: district.BerriesAssigned.map(berry => {
            return {
              Name: berry.Name,
              Id: berry.Id,
              TransactionStatus: "I"
            };
          })
        };
      } else {
        return {
          DistrictName: district.DistrictName,
          DistrictId: district.DistrictId,
          DistrictCode: district.DistrictCode,
          BerriesAssigned: district.BerriesAssigned.map(berry => {
            return {
              Name: berry.Name,
              Id: berry.Id,
              TransactionStatus: berry.TransactionStatus || "A"
            };
          })
        };
      }
    });
  };

  parseDistrictsRanchPlannerToUpload = districts => {
    return districts.map(district => {
      if (district.TransactionStatus === "I") {
        return {
          CompanyName: district.CompanyName,
          CompanyId: district.CompanyId,
          Ranches: district.Ranches.map(ranch => {
            return {
              Name: ranch.Name,
              Id: ranch.Id,
              Code: ranch.Code,
              TransactionStatus: "I"
            };
          })
        };
      } else {
        return {
          CompanyName: district.CompanyName,
          CompanyId: district.CompanyId,
          Ranches: district.Ranches.map(ranch => {
            return {
              Name: ranch.Name,
              Id: ranch.Id,
              Code: ranch.Code,
              TransactionStatus: ranch.TransactionStatus || "A"
            };
          })
        };
      }
    });
  };

  parseDistrictsRanchAdminToUpload = districts => {
    return districts.map(district => {
      if (district.TransactionStatus === "I") {
        return {
          DistrictName: district.DistrictName,
          DistrictId: district.DistrictId,
          DistrictCode: district.DistrictCode,
          Companies: district.Companies.map(company => {
            return {
              Name: company.Name,
              Id: company.Id,
              Code: company.Code,
              TransactionStatus: "I"
            };
          })
        };
      } else {
        return {
          DistrictName: district.DistrictName,
          DistrictId: district.DistrictId,
          DistrictCode: district.DistrictCode,
          Companies: district.Companies.map(company => {
            return {
              Name: company.Name,
              Id: company.Id,
              Code: company.Code,
              TransactionStatus: company.TransactionStatus || "A"
            };
          })
        };
      }
    });
  };

  handleUpdateUser = () => {
    const { editInfo, districts } = this.state;
    const {
      currentEditUser,
      whoIsUpdateUser,
      updateComponent,
      closeEditPopup
    } = this.props;
    let districtsToUpdate = [];
    let payloadEditDistrictInfo = {};
    let personaId = "";
    const payloadEditInfo = {
      login: editInfo.email,
      preferredLanguage: editInfo.preferredLanguage,
      primaryPhone: editInfo.primaryPhone,
      secondaryPhone: editInfo.secondaryPhone
    };
    switch (currentEditUser.persona) {
      case "Regional Admin": {
        districtsToUpdate = this.parseDistrictsRegionalAdminToUpload(districts);
        personaId = 2;
        break;
      }
      case "Harvest Planner": {
        districtsToUpdate = this.parseDistrictsHarvestPlannerToUpload(
          districts
        );
        personaId = 3;
        break;
      }
      case "Ranch Planner": {
        districtsToUpdate = this.parseDistrictsRanchPlannerToUpload(districts);
        personaId = 5;
        break;
      }

      case "Ranch Admin": {
        districtsToUpdate = this.parseDistrictsRanchAdminToUpload(districts);
        personaId = 4;
        break;
      }
      default:
        break;
    }
    // TODO update this codition
    if (currentEditUser.persona === "Ranch Planner") {
      payloadEditDistrictInfo = {
        PersonaDetails: {
          PersonaType: currentEditUser.persona,
          PersonaId: personaId,
          UserOktaId: currentEditUser.id,
          UpdatedById: whoIsUpdateUser.id,
          CountryNumber: 1, //change
          CountryName: currentEditUser.country
        },
        CompainesAssigned: districtsToUpdate
      };
    } else {
      payloadEditDistrictInfo = {
        PersonaDetails: {
          PersonaType: currentEditUser.persona,
          PersonaId: personaId,
          UserOktaId: currentEditUser.id,
          UpdatedById: whoIsUpdateUser.id,
          CountryNumber: 1, //change
          CountryName: currentEditUser.country
        },
        DistrictsAssigned: districtsToUpdate
      };
    }

    this.props.updateUserProfile(payloadEditInfo, () => updateComponent());
    this.props.updateOktaUser(payloadEditDistrictInfo, () => closeEditPopup());
  };

  updateDistricts = (districtsStep, erraseSelect, eraseMultiplySelect) => {
    this.setState({
      districts: districtsStep,
      selectedAssignment: erraseSelect,
      selectedAssignmentHarvestPlanner: eraseMultiplySelect
    });
  };
  render() {
    const { closeEditPopup, classes } = this.props;
    const { editInfo, userStatus } = this.state;
    return (
      <div>
        <div className={classes.edit_popup__title}>
          <Typography
            variant="subtitle1"
            style={{ color: "#29702a", fontWeight: "bold", marginTop: "20px" }}
          >
            Update User
          </Typography>
        </div>
        <div>
          <div className={classes.edit_popup__persona_types}>
            <Grid container spacing={24}>
              <Grid item xl={1}>
                <Typography
                  variant="subtitle2"
                  style={{ color: "black", fontWeight: "bold" }}
                >
                  Persona Type
                </Typography>
              </Grid>
              {!isEmpty(editInfo) && (
                <Grid item xl={11}>
                  <Typography
                    variant="subtitle2"
                    style={{ color: "black", fontWeight: "bold" }}
                  >
                    {editInfo.persona}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </div>
          <Divider light />
          {!isEmpty(editInfo) && (
            <PersonalInformation
              classes={classes}
              currentEditUser={editInfo}
              handleNumberChange={this.handleNumberChange}
              handleNumberSecondaryChange={this.handleNumberSecondaryChange}
              handleLanguageChange={this.handleLanguageChange}
              userStatus={userStatus}
              mode="edit"
            />
          )}
          <Divider light />
          {!isEmpty(editInfo) && (
            <div className={classes.edit_popup__persona_types}>
              {this.getExtraInformation(editInfo)}
            </div>
          )}
        </div>
        <Divider light />
        <div className={classes.edit_popup__actions}>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            className={classes.button}
            onClick={closeEditPopup}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            className={classes.button}
            color="primary"
            onClick={this.handleUpdateUser}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedInUser: state.auth.user,
    whoIsUpdateUser: state.user.userDetails,
    language: state.language.language
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getUserDetails,
      getDistrictAndBerryListByUser,
      getDistrictAndCompanyListByUser,
      getCompanyAndRanchListByUser,
      getCompanyAndRanchPlannerListByUser,
      updateUserProfile,
      updateOktaUser
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Modal));
