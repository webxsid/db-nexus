/* eslint-disable @typescript-eslint/naming-convention */
type TLoadingStatus = "success" | "error" | "warning" | "info";
enum ELoadingActionTypes {
  START_LOADING = "START_LOADING",
  STOP_LOADING = "STOP_LOADING",
}

interface IStartLoadingPayload {
  message: string;
}

interface IStopLoadingPayload {
  reason: string;
  message?: string;
  status: TLoadingStatus;
}

type TLoadingPayload = IStartLoadingPayload | IStopLoadingPayload;

interface ILoadingAction {
  type: ELoadingActionTypes;
  payload: TLoadingPayload;
}

interface ILoadingState {
  active: boolean;
  reason: string;
  message: string;
  status?: TLoadingStatus;
}

export {
  ELoadingActionTypes,
  ILoadingAction,
  ILoadingState,
  IStartLoadingPayload,
  IStopLoadingPayload,
  TLoadingPayload,
  TLoadingStatus,
};
