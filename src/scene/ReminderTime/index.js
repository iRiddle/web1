import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core/";

import CustomTable from "../../components/CustomTable";
import {
  getRemindersList,
  updateReminder
} from "../../services/actions/reminder.action";
import Spanish from "../../login/config/language/spanish";
import English from "../../login/config/language/english";

const styles = theme => ({
  root: {
    margin: "1rem 1rem 0 0",
    display: "flex",
    alignItems: "center"
  },
});
class ReminderTime extends Component {
  state = {
    editReminder: false,
    arrTimePicker: [],
    languageMap: English
  };

  componentDidMount() {
    this.getReminderByUser();
    this.getArrayTimePicker();
    this.setLang();
  };

  setLang() {
    if (localStorage.getItem("preferredLanguage") === "esp") {
      this.setState({languageMap: Spanish})
    } else {
      this.setState({languageMap: English})
    }
  }

  getArrayTimePicker() {
    const x = 15; //minutes interval
    const times = []; // time array
    let tt = 0; // start time
    const ap = [' am', ' pm']; // AM-PM

    //loop to increment the time and push results in array
    for (var i=0;tt<24*60; i++) {
      const hh = Math.floor(tt/60); // getting hours of day in 0-24 format
      const mm = (tt%60); // getting minutes of the hour in 0-55 format
      times[i] = ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
      tt = tt + x;
    }

    this.setState({
      arrTimePicker: times
    });
  }

  getReminderByUser() {
    const { getRemindersList } = this.props;
    getRemindersList({});
  }

  openEdit = row => {
    const { editReminder } = this.state;
    const { updateReminder } = this.props;

    if (editReminder) {
      const data = {
        ConfigId: row.Id,
        ConfigKey: "REMAINDERTIME",
        ConfigValue: row.ConfigValue,
        CreatedBy: row.CreatedBy,
        LastModifiedBy: row.LastModifiedBy
      }
      updateReminder(data);
    }

    this.setState({
      editReminder: !editReminder,
    });
  };

  render() {
    const { languageMap, editReminder, arrTimePicker } = this.state;
    const { classes, remindersList } = this.props;
    const columns = [
      {
        id: "Id",
        numeric: true,
        label: languageMap.reminderId,
        isChecked: true
      },
      {
        id: "ConfigValue",
        numeric: false,
        label: languageMap.triggerTime,
        isChecked: true
      },
      {
        id: "CreatedBy",
        numeric: false,
        label: languageMap.createdBy,
        isChecked: true
      },
      {
        id: "CreatedOn",
        numeric: false,
        label: languageMap.createdOn,
        isChecked: true
      },
      {
        id: "LastModifiedBy",
        numeric: false,
        label: languageMap.lastModifiedBy,
        isChecked: true
      },
      {
        id: "LastModifiedOn",
        numeric: false,
        label: languageMap.lastModifiedOn,
        isChecked: true
      },
      {
        id: "actionEdit",
        numeric: false,
        isChecked: true
      }
    ];

    return (
      <div>
        <div className={classes.root}>
          <Typography variant="subtitle1" style={{ color: "#29702a" }}>
            {languageMap.reminderTitle}
          </Typography>
        </div>
        <CustomTable
          isEdit={editReminder}
          columns={columns}
          data={remindersList || []}
          customStyles={{ marginTop: "20px" }}
          openEdit={this.openEdit}
          arrTimePicker={arrTimePicker}
          tableType={"reminder"}
          languageMap={languageMap}
        />
      </div>
    );
  }
}

ReminderTime.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    remindersList: state.reminder.remindersList,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { getRemindersList, updateReminder },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ReminderTime));