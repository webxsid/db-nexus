import { Store, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducers";
import rootSaga from "./sagas";
import IRootState from "./types";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme", "database"],
};

const persistedReducer = persistReducer<IRootState>(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
  devTools: true,
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store as Store<IRootState>);

export default store;
