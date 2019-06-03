module.exports = {
  okta: {
    apiToken: process.env.OKTA_API_TOKEN,
    baseUrl: process.env.OKTA_BASE_URL,
    clientId: process.env.OKTA_CLIENT_ID,
    redirectUri: process.env.OKTA_REDIECT_URI
  },
  jobTitles: [
    { id: 0, label: "Controller/Accountant", value: "Controller/Accountant" },
    { id: 1, label: "Grower Owner", value: "Grower Owner" },
    { id: 2, label: "President", value: "President" },
    { id: 3, label: "Production Assistant", value: "Production Assistant" },
    { id: 4, label: "Ranch Assistant", value: "Ranch Assistant" },
    { id: 5, label: "Ranch Foreman", value: "Ranch Foreman" },
    { id: 6, label: "Ranch Manager", value: "Ranch Manager" },
    { id: 7, label: "Truck Driver", value: "Truck Driver" },
    { id: 8, label: "Other", value: "Other" }
  ],
  language:[
    { id:0, label:"English", value:"English" },
    { id:1, label:"Spanish", value:"Spanish" }
  ]
};
