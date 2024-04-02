import IFilterState, {
  FilterAction,
  FilterActionTypes,
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
  action: FilterAction
): IFilterState => {
  switch (action.type) {
    case FilterActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload as IFilter,
      };
    case FilterActionTypes.ADD_QUERY:
      return {
        ...state,
        filter: {
          ...state.filter,
          query: action.payload as string,
        },
      };
    case FilterActionTypes.REMOVE_QUERY:
      return {
        ...state,
        filter: {
          ...state.filter,
          query: "",
        },
      };
    case FilterActionTypes.ADD_TYPE:
      return {
        ...state,
        filter: {
          ...state.filter,
          types: [...state.filter.types, action.payload as string],
        },
      };
    case FilterActionTypes.REMOVE_TYPE:
      return {
        ...state,
        filter: {
          ...state.filter,
          types: state.filter.types.filter(
            (type) => type !== (action.payload as string)
          ),
        },
      };
    case FilterActionTypes.CLEAR_TYPE:
      return {
        ...state,
        filter: {
          ...state.filter,
          types: [],
        },
      };
    case FilterActionTypes.SET_SORT:
      return {
        ...state,
        sort: action.payload as ISort,
      };
    case FilterActionTypes.CLEAR_FILTER:
      return {
        ...state,
        filter: {
          query: "",
          types: [],
        },
      };
    case FilterActionTypes.CLEAR_SORT:
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
