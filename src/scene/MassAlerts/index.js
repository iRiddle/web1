import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import {
  withStyles,
  Button,
  Typography,
  IconButton,
  Select,
  MenuItem,
  OutlinedInput,
  FormControl,
  InputLabel,
  Grid
} from "@material-ui/core";
import { AddCircleTwoTone } from "@material-ui/icons";
import { loadCSS } from "fg-loadcss/src/loadCSS";

//import ACTIONS
import {
  getMassAlertDistrictList,
  getMassAlertRanchList,
  postMassAlert
} from "../../services/actions/massAlert.action";

//import components
import Notification from "../../components/Notification";
import ListDistrictAndBerry from "./components/listDistrictAndBerry";

//import other files
import personaMap from "../../login/config/persona";
import { required } from "../../utils/validations";

import English from "../../login/config/language/english";
import Spanish from "../../login/config/language/spanish";

import Form from "react-validation/build/form";
import { CustomInput } from "../../components/CustomForm";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing.unit,
    fontSize: "1rem"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginRight: "1rem"
  },
  buttonContainerSave: {
    padding: 0,
    display: "flex",
    justifyContent: "flex-end"
  },
  welcome: {
    display: "flex",
    justifyContent: "flex-end"
  },
  iconButton: {
    width: "4rem",
    height: "4rem",
    marginTop: "0.3rem"
  },
  textField: {
    width: "100%",
    marginTop: "0.5rem"
  },
  subtitle: {
    color: "#9B9B9B"
  }
});

class MassAlerts extends Component {
  state = {
    showInvitationNotification: false,
    showErrorNotification: false,
    languageMap: English,

    massAlertCompany: [],

    districtId: '',
    companyId: '',
    ranchId: '',
    berryTypeId: '',

    districtName: '',
    companyName: '',
    ranchName: '',
    berryTypeName: '',

    alertTitle: '',
    alertDesc: '',

    dataPost: [],
    dataList: []
  };

  componentDidMount() {
    loadCSS(
      "https://use.fontawesome.com/releases/v5.1.0/css/all.css",
      document.querySelector("#massAlertContent")
    );
    this.setLang();
    this.init();
  }

  setLang() {
    const languageMap = localStorage.getItem("preferredLanguage") === "esp" ? Spanish : English;
    this.setState({ languageMap });
  }

  init() {
    const {
      loggedInUser,
      getMassAlertDistrictList,
      userDetails
    } = this.props;

    getMassAlertDistrictList({
      personaid: personaMap[userDetails.profile.persona],
      useroktaid: loggedInUser.sub || loggedInUser.userId
    });
  };

  handleSave = () => {
    const { loggedInUser, postMassAlert } = this.props;
    const { alertTitle, alertDesc, dataPost } = this.state;

    const data = {
      Title : alertTitle,
      Message : alertDesc,
      Date: moment().format("YYYY-MM-DD"),
      UserOktaId: loggedInUser.sub || loggedInUser.userId,
      MassAlertUserCriteriaRequest: dataPost
    };

    postMassAlert(data, (err) => {
      if (err) {
        this.setState({showErrorNotification: true});
      } else {
        this.setState({showInvitationNotification: true});
      }
    });
  };

  handleAddSelect = () => {
    const {
      districtId, companyId, ranchId, berryTypeId, districtName, companyName,ranchName, berryTypeName, dataPost, dataList } = this.state;

    const data = {};
    districtId && (data.DistrictId = districtId);
    companyId && (data.CompanyId = companyId);
    if (ranchId) {
      data.RanchId = ranchId;
      data.BerrtyId = berryTypeId;
    }
    dataPost.push(data);

    const dataName = {};
    companyId && (dataName.companyName = companyName);
    if (ranchId) {
      dataName.ranchName = ranchName;
      dataName.berryTypeName = berryTypeName;
    }

    const anyDistrict = dataList.find(x => x.districtId === districtId);
    if (anyDistrict) {
      anyDistrict.attribute.push(dataName);
    } else {
      dataList.push({
        districtId: districtId,
        districtName: districtName,
        attribute: companyId ? [dataName] : []
      });
    }

    this.setState({
      districtId: '',
      companyId: '',
      berryTypeId: '',
      ranchId: '',
      massAlertCompany: []
    });
  };

  handleSelectDistrict = (e) => {
    const getCompanyList = this.props.massAlertDistrict.find(x => x.DistrictId === e.target.value);

    this.setState({
      massAlertCompany: getCompanyList.Compaines,
      districtId: e.target.value,
      companyId: '',
      berryTypeId: '',
      ranchId: '',
      districtName: getCompanyList.DistrictName
    });
  }

  handleSelectCompany = (e) => {
    const getCompanyName = this.state.massAlertCompany.find(x => x.Id === e.target.value);
    const { getMassAlertRanchList } = this.props;
    getMassAlertRanchList({companyid: e.target.value});

    this.setState({
      companyId: e.target.value,
      berryTypeId: '',
      ranchId: '',
      companyName: getCompanyName.Name
    });
  }

  handleSelectRanch = (e) => {
    const getBerry = this.props.massAlertRanch.find(x => x.RanchId === e.target.value);

    this.setState({
      ranchId: e.target.value,
      berryTypeId: getBerry.BerryTypeId,
      ranchName: getBerry.RanchName,
      berryTypeName: getBerry.BerryTypeName
    });
  }

  handleDeleteList = (index) => {
    const { dataList, dataPost } = this.state;
    const districtId = dataList[index].districtId;
    const newDataPost = dataPost.filter(x => x.DistrictId !== districtId);

    dataList.splice(index, 1);
    this.setState({dataPost: newDataPost});
  };

  handleCancel = () => {
    this.setState({
      districtId: '',
      companyId: '',
      berryTypeId: '',
      ranchId: '',
      dataPost: [],
      dataList: [],
      alertTitle: '',
      alertDesc: ''
    });
  };

  render() {
    const { classes, massAlertDistrict, massAlertRanch } = this.props;
    const {
      showInvitationNotification,
      showErrorNotification,
      languageMap,
      massAlertCompany,
      dataList
    } = this.state;

    return (
      <div className={classes.root} id="massAlertContent">
        <div style={{ marginTop: "50px" }}>
          <Grid container spacing={8}>
            <Grid item xs={3} style={{padding: "10px", masrginTop: "15px"}}>
              <FormControl variant="outlined" style={{width: "100%"}}>
                <InputLabel htmlFor="outlined-time-simple">
                  {languageMap.selectDistrict}
                </InputLabel>
                <Select
                  onChange={this.handleSelectDistrict}
                  value={this.state.districtId}
                  input={<OutlinedInput labelWidth={100} name="district" id="outlined-district-simple" />}
                >
                  {massAlertDistrict.map((x) => <MenuItem key={x.DistrictId} value={x.DistrictId}>{x.DistrictName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3} style={{padding: "10px", masrginTop: "15px"}}>
              <FormControl variant="outlined" style={{width: "100%"}}>
                <InputLabel htmlFor="outlined-time-simple">
                  {languageMap.selectCompany}
                </InputLabel>
                <Select
                  disabled={!this.state.districtId}
                  onChange={this.handleSelectCompany}
                  value={this.state.companyId}
                  input={<OutlinedInput labelWidth={120} name="company" id="outlined-company-simple" />}
                >
                  {massAlertCompany.map((x) => <MenuItem key={x.Id} value={x.Id}>{x.Name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3} style={{padding: "10px", masrginTop: "15px"}}>
              <FormControl variant="outlined" style={{width: "100%"}}>
                <InputLabel htmlFor="outlined-time-simple">
                  {languageMap.selectRanch}
                </InputLabel>
                <Select
                  disabled={!this.state.companyId}
                  onChange={this.handleSelectRanch}
                  value={this.state.ranchId}
                  input={<OutlinedInput labelWidth={100} name="ranch" id="outlined-ranch-simple" />}
                >
                  {massAlertRanch.map((x) => <MenuItem key={x.RanchId} value={x.RanchId}>{x.RanchName}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3} style={{paddingLeft: "20px"}}>
              <IconButton
                color="inherit"
                onClick={this.handleAddSelect}
                className={classes.iconButton}
                disabled={!this.state.districtId}
              >
                <AddCircleTwoTone className={classes.icon} />
                <Typography style={{ marginLeft: "5px" }}>{languageMap.add}</Typography>
              </IconButton>
            </Grid>
          </Grid>
        </div>
        
        <ListDistrictAndBerry
          dataList={dataList}
          onClick={this.handleDeleteList}
        />

        <div
          className="alert-description-container"
          style={{ marginTop: "30px" }}
        >
          <Form id="alertForm">
            <div className="alert-title">
              <Typography
                variant="subtitle2"
                className={classes.subtitle}
                gutterBottom
              >
                {languageMap.alertTitle}
              </Typography>
              <CustomInput
                required
                id="outlined-required"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                value={this.state.alertTitle}
                onChange={(e) => {
                  this.setState({alertTitle: e.target.value});
                }}
                validations={[required]}
              />
            </div>

            <div className="alert-description" style={{ marginTop: "15px" }}>
              <Typography
                variant="subtitle2"
                className={classes.subtitle}
                gutterBottom
              >
                {languageMap.alertDesc}
              </Typography>
              <CustomInput
                required
                multiline
                rows="4"
                rowsMax="10"
                id="outlined-required"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                value={this.state.alertDesc}
                onChange={(e) => {
                  this.setState({alertDesc: e.target.value});
                }}
                validations={[required]}
              />
            </div>
          </Form>
        </div>

        <div className={classes.welcome}>
          <div className={classes.buttonContainerSave}>
            <Button
              variant="outlined"
              size="large"
              className={classes.button}
              color="secondary"
              onClick={this.handleCancel}
            >
              {languageMap.cancel}
            </Button>
            <Button
              variant="contained"
              size="large"
              className={classes.button}
              color="primary"
              disabled={
                !this.state.dataPost.length>0 ||
                !this.state.alertTitle ||
                !this.state.alertDesc
              }
              onClick={this.handleSave}
            >
              {languageMap.saveAndSend}
            </Button>
          </div>
        </div>
        <Notification
          hideNotification={() => {
            this.setState({ showInvitationNotification: false });
          }}
          open={showInvitationNotification}
          message={languageMap.massAlertSuccessMessage}
          notificationType={"save-send"}
        />
        <Notification
          hideNotification={() => {
            this.setState({ showErrorNotification: false });
          }}
          open={showErrorNotification}
          message={languageMap.errorMessage}
          notificationType={"error"}
        />
      </div>
    );
  }
}

MassAlerts.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    massAlertDistrict: state.massAlert.massAlertDistrict,
    massAlertRanch: state.massAlert.massAlertRanch
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getMassAlertDistrictList,
      getMassAlertRanchList,
      postMassAlert
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MassAlerts));
