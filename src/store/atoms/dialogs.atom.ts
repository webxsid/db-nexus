import { atom } from "jotai";
import { TDialogIds } from "../types";

export const activeDialogAtom = atom<TDialogIds | null>(null);

activeDialogAtom.debugLabel = "Active Dialog Atom";

export const dialogHistoryAtom = atom<TDialogIds[]>([]);

dialogHistoryAtom.debugLabel = "Dialog History Atom";
