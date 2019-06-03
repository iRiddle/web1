module.exports = {
  inviteUsers: {
    personaType: ["Ranch Planner"],
    "Personal Information": {
      "Ranch Planner": [
        "First Name",
        "Last Name",
        "Email",
        "Country",
        "Preferred Language",
        "Job Title"
      ]
    },
    assignment: {
      "Ranch Planner": {
        assignmentMessage: "assignRanches",
        placeholderParent: "selectCompany",
        placeholderChild: "selectRanches"
      }
    }
  },
  manageUsers: {
    personaType: ["Ranch Planner"],
    updateUser: {
      canDeactivate: true
    }
  },
  massAlerts: null,
  reports: null
};
