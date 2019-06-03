module.exports = {
  inviteUsers: {
    personaType: ["Ranch Admin", "Ranch Planner"],
    "Personal Information": {
      "Ranch Admin": [
        "First Name",
        "Last Name",
        "Email",
        "Country",
        "Preferred Language",
        "Job Title"
      ]
    },
    assignment: {
      "Ranch Admin": {
        assignmentMessage: "assignCompanies",
        placeholderParent: "selectDistrict",
        placeholderChild: "selectCompanies"
      },
      "Ranch Planner": {
        assignmentMessage: "assignRanches",
        placeholderParent: "selectCompany",
        placeholderChild: "selectRanches"
      }
    }
  },
  manageUsers: {
    personaType: ["Ranch Admin", "Ranch Planner"],
    updateUser: {
      canDeactivate: true
    }
  },
  massAlerts: null,
  reports: null
};
