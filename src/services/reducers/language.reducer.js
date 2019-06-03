import { SET_PREFERRED_LANGUAGE } from "../constants";
import English from '../../login/config/language/english'
import Spanish from '../../login/config/language/spanish'

const preferredLanguage = localStorage.getItem("preferredLanguage");
const initialLanguage = {
  language: preferredLanguage === "esp" ? Spanish : English
}

export default (state = { ...initialLanguage }, action) => {
  switch (action.type) {
    case SET_PREFERRED_LANGUAGE:
      return {
        ...state,
        language: action.payload
      }
    default:
      return state;
  }
}
