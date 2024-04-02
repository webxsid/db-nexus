import LoadingState, {
  LoadingAction,
  LoadingActionTypes,
} from "../types/loading.types";

const initialState: Array<LoadingState> = [];

const loadingReducer = (
  state = initialState,
  action: LoadingAction
): Array<LoadingState> => {
  switch (action.type) {
    case LoadingActionTypes.START_LOADING:
      return [
        ...state,
        {
          active: true,
          reason: action.payload.reason,
          message: action.payload.message ?? "",
        },
      ];
    case LoadingActionTypes.STOP_LOADING:
      return state.filter(
        (loading) => loading.reason !== action.payload.reason
      );
    default:
      return state;
  }
};

export default loadingReducer;
