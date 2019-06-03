import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core/";
import { CSVLink } from "react-csv";
import faker from "faker";

import CustomTable from "../../components/CustomTable";
import CheckboxList from "../../components/CheckboxList";
import ExportIcon from "../../../assets/images/export.svg";
import FilterIcon from "../../../assets/images/filter.svg";
import {
  getAssociatedUsersList,
  getUserDetailsList,
  filterUserDetailsList
} from "../../services/actions/user.action";
import { setPreferredLanguage } from "../../services/actions/language.action";
import personaMap from "../../login/config/persona";
import RadioButtonMode from "../../components/RadioButtonMode";
import { TextField } from "@material-ui/core";
import { CustomInput } from "../../components/CustomForm";
import Spanish from "../../login/config/language/spanish";
import English from "../../login/config/language/english";

const styles = theme => ({
  root: {
    margin: "1rem 1rem 0 0",
    display: "flex",
    // justifyContent: "space-evenly",
    alignItems: "center"
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

const preferredLanguage = localStorage.getItem("preferredLanguage");
let prefLang = preferredLanguage === "esp" ? Spanish : English;

const initialFaqs = [
  {
    fileName: "FAQs - English Version.pdf",
    fileUrl: "https://s3.us-east-2.amazonaws.com/gpastaticfiles/faq.pdf",
    language: "English",
    createdBy: "Tina Myles",
    createdOn: "21 Dec '18",
    lastModifiedBy: "Tina Myles",
    lastModifiedOn: "21 Dec '18"
  },
  {
    fileName: "FAQs - Spanish Version.pdf",
    fileUrl: "https://s3.us-east-2.amazonaws.com/gpastaticfiles/faq-sp.pdf",
    language: "Spanish",
    createdBy: "Tina Myles",
    createdOn: "21 Dec '18",
    lastModifiedBy: "Tina Myles",
    lastModifiedOn: "21 Dec '18"
  }
];

const languageOptions = [
  {
    Id: 'en-lang',
    value: 'English',
    label: 'English',
  },
  {
    Id: 'esp-lang',
    value: 'Spanish',
    label: 'Spanish',
  }
];

class FaqsList extends Component {
  state = {
    selectedPersona: this.props.accessibleFeatures[0],
    isColumnFilterVisible: false,
    isDistrictFilterVisible: false,
    districts: [],
    faqLanguage: "English",
    columns: [
      {
        id: "fileName",
        numeric: false,
        label: prefLang["fileName"],
        isChecked: true
      },
      {
        id: "language",
        numeric: false,
        label: prefLang["language"],
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
    this.setState({
      districts: this.getDistrictFilters()
    });
    this.getLanguageMap();
    this.getAssociatedUsersForSelectedPersona(this.props.accessibleFeatures[0]);
  };

  getLanguageMap() {
    const { userDetails, loggedInUser, setPreferredLanguage } = this.props;
    const preferredLanguage = localStorage.getItem("preferredLanguage");
    let languageMap = preferredLanguage === "esp" ? Spanish : English;

    if (userDetails) {
      setPreferredLanguage({ login: loggedInUser.email || loggedInUser.login }, () => {  })
    }

    this.setState({ languageMap })
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

  switchLanguage = (key, value) => {
    this.setState({ faqLanguage: value });
  };

  render() {
    const {
      columns,
      // languageMap
    } = this.state;
    const {
      classes,
      language: languageMap
    } = this.props;
    // const exportData = this.getExportdata();
    return (
      <div>
        <div className={classes.root}>
          {/*<div className={classes.textFieldContainer}>*/}
          {/*<img*/}
          {/*src={FilterIcon}*/}
          {/*className={classes.icon}*/}
          {/*onClick={() => {*/}
          {/*this.toggleFilter("column");*/}
          {/*}}*/}
          {/*/>*/}
          {/*<span style={{ paddingRight: "1.5rem" }}>*/}
          {/*{languageMap.filterColumn}*/}
          {/*</span>*/}
          {/*<img*/}
          {/*src={FilterIcon}*/}
          {/*className={classes.icon}*/}
          {/*onClick={() => {*/}
          {/*this.toggleFilter("district");*/}
          {/*}}*/}
          {/*/>*/}
          {/*<span style={{ paddingRight: "1.5rem" }}>*/}
          {/*{languageMap.filterDistrict}*/}
          {/*</span>*/}
          {/*<CSVLink data={exportData} filename={"ManageUser.csv"}>*/}
          {/*<img src={ExportIcon} className={classes.icon} />*/}
          {/*</CSVLink>*/}
          {/*<span>{languageMap.export}</span>*/}
          {/*</div>*/}
          {/*{isColumnFilterVisible && (*/}
          {/*<CheckboxList*/}
          {/*title={languageMap.filterColumns}*/}
          {/*checkboxItems={columns}*/}
          {/*filterColumns={this.filterColums}*/}
          {/*/>*/}
          {/*)}*/}
          {/*{isDistrictFilterVisible && (*/}
          {/*<CheckboxList*/}
          {/*title={languageMap.filterDistricts}*/}
          {/*checkboxItems={districts}*/}
          {/*filterColumns={this.filterDistricts}*/}
          {/*/>*/}
          {/*)}*/}
          <Typography variant="subtitle1" style={{ color: "#29702a" }}>
            {languageMap.faq}
          </Typography>
        </div>
        <div className="faq-upload-form">
          <RadioButtonMode
            style={{ padding: 0 }}
            key="language"
            id="language"
            mode="edit"
            value={this.state.faqLanguage}
            options={languageOptions}
            handleChange={this.switchLanguage}
          />
          <div className="file-form">
            <TextField
              margin="none"
              variant="outlined"
              onChange={this.handleInputChange}
              key="file"
              id="file"
              type="text"
              value=""
              placeholder="Upload a file"
              inputProps={{
                style: { padding: "10px", fontSize: "13px" },
                readOnly: true
              }}
            />
            <Button
              variant="contained"
              size="large"
              color="primary"
              style={{
                padding: "6px 24px",
                marginLeft: "12px",
                boxShadow: "none",
                cursor: "pointer"
              }}
            >
              <label htmlFor="faqUpload" style={{ cursor: "pointer" }}>
                {languageMap.browse}
              </label>
            </Button>
            <input type="file" id="faqUpload" style={{ display: "none" }} />
            {/*<InputMode*/}
            {/*key={"file"}*/}
            {/*id={"file"}*/}
            {/*mode={"file"}*/}
            {/*value={""}*/}
            {/*handleChange={(e) => console.log(e)}*/}
            {/*width={"40%"}*/}
            {/*validations={[]}*/}
            {/*/>*/}
          </div>
        </div>
        <CustomTable
          columns={columns}
          data={initialFaqs}
          customStyles={{ marginTop: "60px" }}
        />
      </div>
    );
  }
}

FaqsList.propTypes = {
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
    { getAssociatedUsersList, getUserDetailsList, filterUserDetailsList, setPreferredLanguage },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FaqsList));
