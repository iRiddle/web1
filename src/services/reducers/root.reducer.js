import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import userReducer from "./user.reducer";
import personaReducer from "./persona.reducer";
import languageReducer from './language.reducer';
import reminderReducer from './reminder.reducer';
import massAlertReducer from './massAlert.reducer';

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  persona: personaReducer,
  language: languageReducer,
  reminder: reminderReducer,
  massAlert: massAlertReducer
});
