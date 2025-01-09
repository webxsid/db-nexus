import {
  IFilterAction,
  EFilterActionTypes,
  IFilter,
  ISort,
} from "../types/filter.types";

const setFilter = (payload: IFilter): IFilterAction => {
  return {
    type: EFilterActionTypes.SET_FILTER,
    payload,
  };
};
const addQuery = (payload: string): IFilterAction => {
  return {
    type: EFilterActionTypes.ADD_QUERY,
    payload,
  };
};
const removeQuery = (): IFilterAction => {
  return {
    type: EFilterActionTypes.REMOVE_QUERY,
  };
};

const addType = (payload: string): IFilterAction => {
  return {
    type: EFilterActionTypes.ADD_TYPE,
    payload,
  };
};

const removeType = (payload: string): IFilterAction => {
  return {
    type: EFilterActionTypes.REMOVE_TYPE,
    payload,
  };
};

const clearType = (): IFilterAction => {
  return {
    type: EFilterActionTypes.CLEAR_TYPE,
  };
};

const setSort = (payload: ISort): IFilterAction => {
  return {
    type: EFilterActionTypes.SET_SORT,
    payload,
  };
};

const clearFilter = (): IFilterAction => {
  return {
    type: EFilterActionTypes.CLEAR_FILTER,
  };
};

const clearSort = (): IFilterAction => {
  return {
    type: EFilterActionTypes.CLEAR_SORT,
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
