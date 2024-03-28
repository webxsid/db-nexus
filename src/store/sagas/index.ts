import { all } from "redux-saga/effects";
import watchLoading from "./loading.saga";
const rootSaga = function* () {
  yield all([watchLoading()]);
};

export default rootSaga;
