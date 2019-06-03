module.exports = {
  inviteUsers: {
    personaType: ["Regional Admin", "Harvest Planner"],
    "Personal Information": {
      "Regional Admin": [
        "First Name",
        "Last Name",
        "Email",
        "Country",
        "Preferred Language"
      ],
      "Harvest Planner": [
        "First Name",
        "Last Name",
        "Email",
        "Country",
        "Preferred Language"
      ]
    },
    assignment: {
      "Regional Admin": {
        assignmentMessage: "assignDistricts",
        placeholderChild: "selectDistricts"
      },
      "Harvest Planner": {
        assignmentMessage: "assignDistrictsAndBerryTypes",
        placeholderParent: "selectDistrict",
        placeholderChild: "selectBerryTypes"
      }
    }
  },
  manageUsers: {
    personaType: [
      "Regional Admin",
      "Harvest Planner",
      "Ranch Admin",
      "Ranch Planner"
    ],
    updateUser: {
      canDelete: true,
      canDeactivate: true
    }
  },
  faqs: ["create", "view"],
  reminderTime: null,
  reports: null
};
