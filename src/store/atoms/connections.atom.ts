import { IDatabaseConnection } from "@shared";
import { atom } from "jotai";

export const connectionsAtom = atom<Array<IDatabaseConnection<unknown>>>([]);
connectionsAtom.debugLabel = "Saved Connections";
export const selectedConnectionAtom = atom<IDatabaseConnection<unknown> | null>(
  null,
);
selectedConnectionAtom.debugLabel = "Selected Connection";
export const addConnectionAtom = atom(
  null,
  (_get, set, connection: IDatabaseConnection<unknown>) => {
    set(connectionsAtom, (prev) => [...prev, connection]);
  },
);

export const removeConnectionAtom = atom(null, (_get, set, id: string) => {
  set(connectionsAtom, (prev) =>
    prev.filter((connection) => connection.id !== id),
  );
});

export const updateConnectionAtom = atom(
  null,
  (_get, set, connection: IDatabaseConnection<unknown>) => {
    set(connectionsAtom, (prev) =>
      prev.map((c) => (c.id === connection.id ? connection : c)),
    );
  },
);

export const selectConnectionAtom = atom(
  null,
  (_get, set, connectionId: string) => {
    const connections = _get(connectionsAtom);
    const connection = connections.find((c) => c.id === connectionId);
    if (connection) {
      set(selectedConnectionAtom, connection);
    }
  },
);

export const clearSelectedConnectionAtom = atom(null, (_get, set) => {
  set(selectedConnectionAtom, null);
});

export const refreshConnectionsAtom = atom(
  null,
  (_get, set, connections: Array<IDatabaseConnection<unknown>>) => {
    set(connectionsAtom, connections);
  },
);
