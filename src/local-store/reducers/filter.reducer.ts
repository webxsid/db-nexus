import IFilterState, {
  IFilterAction,
  EFilterActionTypes,
  IFilter,
  ISort,
} from "../types/filter.types";

const initialState: IFilterState = {
  filter: {
    query: "",
    types: [],
  },
  sort: {
    field: "lastConnectionAt",
    order: "desc",
  },
};

const filterReducer = (
  state = initialState,
  action: IFilterAction
): IFilterState => {
  switch (action.type) {
    case EFilterActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload as IFilter,
      };
    case EFilterActionTypes.ADD_QUERY:
      return {
        ...state,
        filter: {
          ...state.filter,
          query: action.payload as string,
        },
      };
    case EFilterActionTypes.REMOVE_QUERY:
      return {
        ...state,
        filter: {
          ...state.filter,
          query: "",
        },
      };
    case EFilterActionTypes.ADD_TYPE:
      return {
        ...state,
        filter: {
          ...state.filter,
          types: [...state.filter.types, action.payload as string],
        },
      };
    case EFilterActionTypes.REMOVE_TYPE:
      return {
        ...state,
        filter: {
          ...state.filter,
          types: state.filter.types.filter(
            (type) => type !== (action.payload as string)
          ),
        },
      };
    case EFilterActionTypes.CLEAR_TYPE:
      return {
        ...state,
        filter: {
          ...state.filter,
          types: [],
        },
      };
    case EFilterActionTypes.SET_SORT:
      return {
        ...state,
        sort: action.payload as ISort,
      };
    case EFilterActionTypes.CLEAR_FILTER:
      return {
        ...state,
        filter: {
          query: "",
          types: [],
        },
      };
    case EFilterActionTypes.CLEAR_SORT:
      return {
        ...state,
        sort: {
          field: null,
          order: null,
        },
      };
    default:
      return state;
  }
};

export { initialState as filterInitialState };
export default filterReducer;
