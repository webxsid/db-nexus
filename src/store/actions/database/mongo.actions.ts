import {
  MongoAction,
  MongoActionPayload,
  MongoActionTypes,
} from "@/store/types";

const addDatabase = (payload: MongoActionPayload): MongoAction => ({
  type: MongoActionTypes.ADD_DATABASE,
  payload: {
    ...payload,
    createdAt: new Date(),
  },
});

const removeDatabase = (payload: MongoActionPayload): MongoAction => ({
  type: MongoActionTypes.REMOVE_DATABASE,
  payload,
});

const updateDatabase = (payload: MongoActionPayload): MongoAction => ({
  type: MongoActionTypes.UPDATE_DATABASE,
  payload,
});

export default { addDatabase, removeDatabase, updateDatabase };
