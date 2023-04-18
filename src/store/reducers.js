import { combineReducers } from "redux";

import dataReducer from "./data/reducer";

const rootReducer = combineReducers({
  dataReducer,
});

export default rootReducer;
