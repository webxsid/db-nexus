type SortType = "asc" | "desc" | null;
type SortField = "name" | "createdAt" | "lastConnectionAt" | null;
interface IFilter {
  query: string;
  types: Array<string>;
}

interface ISort {
  field: SortField;
  order: SortType;
}

interface IFilterState {
  filter: IFilter;
  sort: ISort;
}

enum FilterActionTypes {
  SET_FILTER = "SET_FILTER",
  CLEAR_FILTER = "CLEAR_FILTER",
  ADD_QUERY = "ADD_QUERY",
  REMOVE_QUERY = "REMOVE_QUERY",
  ADD_TYPE = "ADD_TYPE",
  REMOVE_TYPE = "REMOVE_TYPE",
  CLEAR_TYPE = "CLEAR_TYPE",
  SET_SORT = "SET_SORT",
  CLEAR_SORT = "CLEAR_SORT",
}

type FilterActionPayload = IFilter | ISort | string | undefined | null;

interface FilterAction {
  type: FilterActionTypes;
  payload: FilterActionPayload;
}

export {
  IFilter,
  ISort,
  FilterAction,
  FilterActionPayload,
  FilterActionTypes,
  SortType,
  SortField,
};
export default IFilterState;
