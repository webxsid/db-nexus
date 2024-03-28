import { takeEvery } from "redux-saga/effects";
import {
  LoadingActionTypes,
  LoadingAction,
  StartLoadingPayload,
  StopLoadingPayload,
} from "../types";
import { toast } from "react-toastify";

function* onStartLoading(action: LoadingAction) {
  try {
    const { reason, message } = action.payload as StartLoadingPayload;
    toast.loading(message, {
      toastId: reason,
      position: "bottom-center",
    });
    yield;
  } catch (e) {
    console.error(e);
  }
}

function* onStopLoading(action: LoadingAction) {
  try {
    const { reason, message, status } = action.payload as StopLoadingPayload;
    if (toast.isActive(reason)) toast.dismiss(reason);
    switch (status) {
      case "success":
        toast.success(message, {
          toastId: reason,
          position: "bottom-center",
        });
        break;
      case "error":
        toast.error(message, {
          toastId: reason,
          position: "bottom-center",
        });
        break;
      case "warning":
        toast.warning(message, {
          toastId: reason,
          position: "bottom-center",
        });
        break;
      case "info":
        toast.info(message, {
          toastId: reason,
          position: "bottom-center",
        });
        break;
    }
    yield;
  } catch (e) {
    console.error(e);
  }
}

function* watchLoading() {
  yield takeEvery(LoadingActionTypes.START_LOADING, onStartLoading);
  yield takeEvery(LoadingActionTypes.STOP_LOADING, onStopLoading);
}

export default watchLoading;
