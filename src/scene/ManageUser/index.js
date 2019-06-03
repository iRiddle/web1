import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { Button, Typography, ClickAwayListener } from "@material-ui/core/";
import { CSVLink } from "react-csv";
import faker from "faker";

import CustomTable from "../../components/CustomTable";
import CheckboxList from "../../components/CheckboxList";
import Modal from "../../components/Modal";
import ExportIcon from "../../../assets/images/export.svg";
import FilterIcon from "../../../assets/images/filter.svg";
import {
  getAssociatedUsersList,
  getUserDetailsList,
  filterUserDetailsList
} from "../../services/actions/user.action";
import { setPreferredLanguage } from "../../services/actions/language.action";
import personaMap from "../../login/config/persona";
import Spanish from "../../login/config/language/spanish";
import English from "../../login/config/language/english";
const styles = theme => ({
  root: {
    margin: "1rem",
    display: "flex",
    justifyContent: "space-evenly",
    alignItmes: "center"
    // padding: "0 2rem",
    // paddingBottom: "1.5rem"
  },
  button: {
    maxHeight: "40px",
    minHeight: "40px",
    borderRadius: "100px"
  },
  buttonContainer: {
    flex: 2,
    display: "flex",
    width: "fit-content"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 150
  },
  textFieldContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  formControl: {
    margin: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    minWidth: "100%"
  },
  icon: {
    padding: "0 0.5rem",
    height: "1.5rem",
    cursor: "pointer",
    filter:
      "invert(40%) sepia(16%) saturate(1299%) hue-rotate(61deg) brightness(98%) contrast(88%)"
  }
});

// const languageMap = JSON.parse(localStorage.getItem("languageMap"));
const preferredLanguage = localStorage.getItem("preferredLanguage");
let prefLang = preferredLanguage === "esp" ? Spanish : English;

class ManageUser extends Component {
  state = {
    selectedPersona: this.props.accessibleFeatures[0],
    isColumnFilterVisible: false,
    isDistrictFilterVisible: false,
    districts: [],
    isEditUserPopupOpened: false,
    currentEditUser: {},
    componentUpdate: false,
    columns: [
      {
        id: "action",
        numeric: false,
        label: prefLang["action"],
        isChecked: true
      },
      {
        id: "status",
        numeric: false,
        label: prefLang["status"],
        isChecked: true
      },
      {
        id: "name",
        numeric: false,
        label: prefLang["name"],
        isChecked: true
      },
      {
        id: "language",
        numeric: false,
        label: prefLang["language"],
        isChecked: true
      },
      {
        id: "assignment",
        numeric: false,
        label: prefLang["assignment"],
        isChecked: true
      },
      {
        id: "country",
        numeric: false,
        label: prefLang["country"],
        isChecked: true
      },
      {
        id: "lastLogOn",
        numeric: false,
        label: prefLang["lastLogOn"],
        isChecked: true
      },
      {
        id: "createdBy",
        numeric: false,
        label: prefLang["createdBy"],
        isChecked: true
      },
      {
        id: "createdOn",
        numeric: false,
        label: prefLang["createdOn"],
        isChecked: true
      },
      {
        id: "lastModifiedBy",
        numeric: false,
        label: prefLang["lastModifiedBy"],
        isChecked: true
      },
      {
        id: "lastModifiedOn",
        numeric: false,
        label: prefLang["lastModifiedOn"],
        isChecked: true
      }
    ],
    languageMap: prefLang
  };

  componentDidMount() {
    this.getLanguageMap();
    this.setState({
      districts: this.getDistrictFilters()
    });
    this.getAssociatedUsersForSelectedPersona(this.props.accessibleFeatures[0]);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.componentUpdate !== prevState.componentUpdate) {
      this.getLanguageMap();
      this.setState({
        districts: this.getDistrictFilters()
      });
      this.getAssociatedUsersForSelectedPersona(
        this.props.accessibleFeatures[0]
      );
      this.setState({
        componentUpdate: false
      });
    }
  }
  getLanguageMap() {
    const { userDetails, loggedInUser, setPreferredLanguage } = this.props;
    const preferredLanguage = localStorage.getItem("preferredLanguage");
    let languageMap = preferredLanguage === "esp" ? Spanish : English;

    if (userDetails) {
      setPreferredLanguage(
        { login: loggedInUser.email || loggedInUser.login },
        () => {}
      );
    }

    this.setState({ languageMap });
  }

  filterColums = (id, isChecked) => {
    const { columns } = this.state;

    let modifiedColumns = columns.map(column => {
      if (column.id === id) {
        column.isChecked = isChecked;
      }
      return column;
    });
    this.setState({
      columns: modifiedColumns
    });
  };

  filterDistricts = (id, isChecked) => {
    const { districts } = this.state;
    let modifiedDistricts = districts.map(district => {
      if (district.id === id) {
        district.isChecked = isChecked;
      }
      return district;
    });
    this.setState({
      district: modifiedDistricts
    });
    this.filterTableData();
  };

  getDistrictFilters = () => {
    const assignmentData = this.getAssignmentData() || [];
    return assignmentData.map((assignment, index) => ({
      id: index,
      label:
        assignment.DistrictName || assignment.CompanyName || assignment.Name,
      isChecked: true
    }));
  };

  filterTableData = () => {
    let { districts, selectedPersona } = this.state;
    let { userDetailsList, filterUserDetailsList } = this.props;
    let checkedDistricts = districts.filter(
      district => district.isChecked === true
    );
    let tableData = [];

    if (userDetailsList && userDetailsList[selectedPersona]) {
      tableData = userDetailsList[selectedPersona].filter(userDetail => {
        let isRowReturned = false;
        checkedDistricts.forEach(district => {
          if (userDetail.assignment.indexOf(district.label) > -1) {
            isRowReturned = true;
          }
        });
        if (isRowReturned) {
          return userDetail;
        }
      });
    }
    filterUserDetailsList({
      persona: selectedPersona,
      userDetails: tableData
    });
  };

  /**
   * @returns assignment data based on persona.
   */
  getAssignmentData = () => {
    const {
      persona,
      districtAndBerryList,
      districtAndCompanyList,
      companyAndRanchList
    } = this.props;

    switch (persona) {
      case "Super Admin":
        return districtAndBerryList;

      case "Regional Admin":
        return districtAndCompanyList;

      case "Ranch Admin":
        return companyAndRanchList;

      default:
        break;
    }
  };

  getAssociatedUsersForSelectedPersona = selectedPersona => {
    const {
      persona,
      oktaId,
      getAssociatedUsersList,
      getUserDetailsList
    } = this.props;
    let query = {
      requestedpersonaid: personaMap[selectedPersona],
      useroktaid: oktaId,
      personaid: personaMap[persona]
    };
    getAssociatedUsersList(query, (err, res) => {
      if (!err) {
        getUserDetailsList({
          usersList: res,
          requestedPersona: selectedPersona
        });
      }
    });
    this.setState({ selectedPersona });
  };

  getSelectedMenuStyle = isSelected => {
    let style = { fontSize: 12, letterSpacing: "1px", margin: "0 0.7rem" };
    style.color = isSelected ? "#ffffff" : "#6f6b6b";
    return style;
  };

  getExportdata = () => {
    const { columns, selectedPersona } = this.state;
    const { userDetailsList } = this.props;
    if (userDetailsList && userDetailsList[selectedPersona]) {
      return userDetailsList[selectedPersona].map((row, rowIndex) => {
        let exportRow = {};
        exportRow["S.No."] = toString(rowIndex + 1);
        columns.map(column => {
          if (column.isChecked && column.id !== "action") {
            exportRow[column.id] = row[column.id];
          }
        });
        return exportRow;
      });
    } else {
      return [];
    }
  };

  toggleFilter = filterType => {
    if (filterType === "column") {
      this.setState({
        isColumnFilterVisible: !this.state.isColumnFilterVisible,
        isDistrictFilterVisible: false
      });
    } else {
      this.setState({
        isDistrictFilterVisible: !this.state.isDistrictFilterVisible,
        isColumnFilterVisible: false
      });
    }
  };

  getUsersCount = () => {
    const { userDetailsList } = this.props;
    const { selectedPersona } = this.state;
    let usersCount = " (0)";
    if (userDetailsList && userDetailsList[selectedPersona])
      usersCount = ` (${userDetailsList[selectedPersona].length})`;
    return usersCount;
  };

  closeEditPopup = () => {
    this.setState({
      isEditUserPopupOpened: false
    });
  };

  openEditPopup = row => {
    this.setState({
      isEditUserPopupOpened: true,
      currentEditUser: row
    });
  };
  updateComponent = () => {
    this.setState({
      componentUpdate: true
    });
  };
  render() {
    const {
      columns,
      districts,
      selectedPersona,
      isColumnFilterVisible,
      isDistrictFilterVisible,
      isEditUserPopupOpened,
      currentEditUser
      // languageMap
    } = this.state;
    const {
      classes,
      personaTypes,
      filterdUserDetailsList,
      accessibleFeatures,
      userDetailsList,
      language: languageMap
    } = this.props;
    const exportData = this.getExportdata();
    return isEditUserPopupOpened ? (
      <Modal
        currentEditUser={currentEditUser}
        isEditUserPopupOpened={isEditUserPopupOpened}
        closeEditPopup={this.closeEditPopup}
        updateComponent={this.updateComponent}
      />
    ) : (
      <div>
        <div className={classes.root}>
          <div className={classes.buttonContainer}>
            {personaTypes.map(
              persona =>
                accessibleFeatures.indexOf(persona.Name) > -1 && (
                  <Button
                    variant={
                      persona.Name === selectedPersona ? "contained" : null
                    }
                    color={
                      persona.Name === selectedPersona ? "secondary" : null
                    }
                    size="small"
                    key={persona.Name}
                    className={classes.button}
                    onClick={() =>
                      this.getAssociatedUsersForSelectedPersona(persona.Name)
                    }
                  >
                    <Typography
                      style={this.getSelectedMenuStyle(
                        persona.Name === selectedPersona ? true : false
                      )}
                    >
                      {persona.Name === selectedPersona
                        ? persona.Name + this.getUsersCount()
                        : persona.Name}
                    </Typography>
                  </Button>
                )
            )}
          </div>
          <div className={classes.textFieldContainer}>
            <img
              src={FilterIcon}
              className={classes.icon}
              onClick={() => {
                this.toggleFilter("column");
              }}
            />
            <span style={{ paddingRight: "1.5rem" }}>
              {languageMap.filterColumn}
            </span>
            <img
              src={FilterIcon}
              className={classes.icon}
              onClick={() => {
                this.toggleFilter("district");
              }}
            />
            <span style={{ paddingRight: "1.5rem" }}>
              {languageMap.filterDistrict}
            </span>
            <CSVLink data={exportData} filename={"ManageUser.csv"}>
              <img src={ExportIcon} className={classes.icon} />
            </CSVLink>
            <span>{languageMap.export}</span>
          </div>
          {isColumnFilterVisible && (
            <ClickAwayListener
              onClickAway={() =>
                this.setState({ isColumnFilterVisible: false })
              }
            >
              <CheckboxList
                title={languageMap.filterColumns}
                checkboxItems={columns}
                filterColumns={this.filterColums}
              />
            </ClickAwayListener>
          )}
          {isDistrictFilterVisible && (
            <ClickAwayListener
              onClickAway={() =>
                this.setState({ isDistrictFilterVisible: false })
              }
            >
              <CheckboxList
                title={languageMap.filterDistricts}
                checkboxItems={districts}
                filterColumns={this.filterDistricts}
              />
            </ClickAwayListener>
          )}
        </div>
        <CustomTable
          columns={columns}
          data={
            (filterdUserDetailsList &&
              filterdUserDetailsList[selectedPersona]) ||
            (userDetailsList && userDetailsList[selectedPersona]) ||
            []
          }
          openEditPopup={this.openEditPopup}
        />
      </div>
    );
  }
}

ManageUser.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    associatedUsers: state.user.associatedUsers,
    userDetailsList: state.user.userDetailsList,
    filterdUserDetailsList: state.user.filterdUserDetailsList,
    districtAndBerryList: state.persona.districtAndBerryList,
    districtAndCompanyList: state.persona.districtAndCompanyList,
    companyAndRanchList: state.persona.companyAndRanchList,
    language: state.language.language
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getAssociatedUsersList,
      getUserDetailsList,
      filterUserDetailsList,
      setPreferredLanguage
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ManageUser));
