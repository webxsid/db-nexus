import {
  LoadingAction,
  LoadingActionTypes,
  StartLoadingPayload,
  StopLoadingPayload,
} from "../types";

const startLoading = (payload: StartLoadingPayload): LoadingAction => ({
  type: LoadingActionTypes.START_LOADING,
  payload,
});

const stopLoading = (payload: StopLoadingPayload): LoadingAction => ({
  type: LoadingActionTypes.STOP_LOADING,
  payload,
});

export default { startLoading, stopLoading };
