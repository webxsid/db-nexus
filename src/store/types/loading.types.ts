type LoadingStatus = "success" | "error" | "warning" | "info";
enum LoadingActionTypes {
  START_LOADING = "START_LOADING",
  STOP_LOADING = "STOP_LOADING",
}

interface StartLoadingPayload {
  reason: string;
  message: string;
}

interface StopLoadingPayload {
  reason: string;
  message?: string;
  status: LoadingStatus;
}

type LoadingPayload = StartLoadingPayload | StopLoadingPayload;

interface LoadingAction {
  type: LoadingActionTypes;
  payload: LoadingPayload;
}

interface LoadingState {
  active: boolean;
  reason: string;
  message: string;
}

export {
  LoadingActionTypes,
  LoadingAction,
  StartLoadingPayload,
  StopLoadingPayload,
  LoadingPayload,
  LoadingStatus,
};
export default LoadingState;
