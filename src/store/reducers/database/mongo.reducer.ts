import {
  MongoDatabaseState,
  MongoAction,
  MongoActionTypes,
} from "@/store/types";

const initialState: Array<MongoDatabaseState> = [];

const mongoReducer = (
  state = initialState,
  action: MongoAction
): Array<MongoDatabaseState> => {
  switch (action.type) {
    case MongoActionTypes.ADD_DATABASE:
      console.log("Adding database", action.payload);
      return [...state, action.payload as MongoDatabaseState];
    case MongoActionTypes.REMOVE_DATABASE:
      return state.filter((db) => db.id !== (action.payload as string));
    case MongoActionTypes.UPDATE_DATABASE:
      return state.map((db) => {
        if (db.id === (action.payload as MongoDatabaseState).id) {
          return {
            ...db,
            ...action.payload,
          };
        }
        return db;
      });
    default:
      return state;
  }
};

export default mongoReducer;
