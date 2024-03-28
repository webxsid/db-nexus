import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./theme.reducer";
import databaseReducer from "./database";
import loadingReducer from "./loading.reducer";

const rootReducer = combineReducers({
  theme: themeReducer,
  database: databaseReducer,
  loading: loadingReducer,
});

export default rootReducer;
