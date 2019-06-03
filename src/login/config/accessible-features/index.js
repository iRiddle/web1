import SuperAdmin from "./SuperAdmin";
import RegionalAdmin from "./RegionalAdmin";
import HarvestPlanner from "./HarvestPlanner";
import RanchAdmin from "./RanchAdmin";
import {
  SUPER_ADMIN,
  REGINONAL_ADMIN,
  HARVEST_PLANNER,
  RANCH_ADMIN
} from "../features";

const getAccessibleFeature = persona => {
  switch (persona) {
    case SUPER_ADMIN:
      return SuperAdmin;
    case REGINONAL_ADMIN:
      return RegionalAdmin;
    case HARVEST_PLANNER:
      return HarvestPlanner;
    case RANCH_ADMIN:
      return RanchAdmin;
    default:
      return new Error(
        "Error!! Content not accessible. Please contact system admin."
      );
  }
};

export default getAccessibleFeature;
