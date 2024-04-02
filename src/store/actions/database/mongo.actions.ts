import {
  MongoAction,
  MongoActionPayload,
  MongoActionTypes,
  MongoDatabaseState,
} from "@/store/types";

const addDatabase = (payload: MongoActionPayload): MongoAction => ({
  type: MongoActionTypes.ADD_DATABASE,
  payload: {
    ...(payload as MongoDatabaseState),
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
