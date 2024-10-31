import { ECoreIpcEvents } from "../../../constants";
import { IDatabaseConnection } from "../../ipc-interfaces";

export interface ICoreIpcEventsResponse {
  [ECoreIpcEvents.AddConnection]: {
    ok: 0 | 1;
    connectionId: string;
    meta: IDatabaseConnection<unknown>;
  };
  [ECoreIpcEvents.RemoveConnection]: {
    connectionId: string;
    ok: 0 | 1;
  };
  [ECoreIpcEvents.UpdateConnection]: {
    connectionId: string;
    meta: IDatabaseConnection<unknown>;
    ok: 0 | 1;
  };
  [ECoreIpcEvents.ListConnections]: {
    connections: Array<IDatabaseConnection<unknown>>;
    ok: 0 | 1;
  };
  [ECoreIpcEvents.GetConnection]: {
    ok: 0 | 1;
    connectionId: string;
    meta: IDatabaseConnection<unknown>;
  };
  [ECoreIpcEvents.DuplicateConnection]: {
    ok: 0 | 1;
  };
  [ECoreIpcEvents.QueryConnections]: {
    ok: 0 | 1;
    connections: Array<IDatabaseConnection<unknown>>;
  };
}
