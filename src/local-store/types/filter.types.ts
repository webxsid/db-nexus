type TSortType = "asc" | "desc" | null;
type TSortField = "name" | "createdAt" | "lastConnectionAt" | null;
interface IFilter {
  query: string;
  types: string[];
}

interface ISort {
  field: TSortField;
  order: TSortType;
}

interface IFilterState {
  filter: IFilter;
  sort: ISort;
}

enum EFilterActionTypes {
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

type TFilterActionPayload = IFilter | ISort | string | undefined | null;

interface IFilterAction {
  type: EFilterActionTypes;
  payload?: TFilterActionPayload;
}

export {
  IFilter,
  ISort,
  IFilterAction,
  TFilterActionPayload,
  EFilterActionTypes,
  TSortType,
  TSortField,
};
export default IFilterState;
