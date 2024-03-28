import { combineReducers } from "@reduxjs/toolkit";
import mongoReducer from "./mongo.reducer";

const databaseReducer = combineReducers({
  mongo: mongoReducer,
});

export default databaseReducer;
