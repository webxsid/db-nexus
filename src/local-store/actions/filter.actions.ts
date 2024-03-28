import {
  FilterAction,
  FilterActionTypes,
  IFilter,
  ISort,
} from "../types/filter.types";

const setFilter = (payload: IFilter): FilterAction => {
  return {
    type: FilterActionTypes.SET_FILTER,
    payload,
  };
};
const addQuery = (payload: string): FilterAction => {
  return {
    type: FilterActionTypes.ADD_QUERY,
    payload,
  };
};
const removeQuery = (): FilterAction => {
  return {
    type: FilterActionTypes.REMOVE_QUERY,
  };
};

const addType = (payload: string): FilterAction => {
  return {
    type: FilterActionTypes.ADD_TYPE,
    payload,
  };
};

const removeType = (payload: string): FilterAction => {
  return {
    type: FilterActionTypes.REMOVE_TYPE,
    payload,
  };
};

const clearType = (): FilterAction => {
  return {
    type: FilterActionTypes.CLEAR_TYPE,
  };
};

const setSort = (payload: ISort): FilterAction => {
  return {
    type: FilterActionTypes.SET_SORT,
    payload,
  };
};

const clearFilter = (): FilterAction => {
  return {
    type: FilterActionTypes.CLEAR_FILTER,
  };
};

const clearSort = (): FilterAction => {
  return {
    type: FilterActionTypes.CLEAR_SORT,
  };
};

export default {
  setFilter,
  addQuery,
  removeQuery,
  addType,
  removeType,
  clearType,
  setSort,
  clearFilter,
  clearSort,
};
