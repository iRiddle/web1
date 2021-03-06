import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./src/services/reducers/root.reducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState = {}) {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
}
