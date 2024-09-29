import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import IRootState, { IThemeState } from "../types";
import { CoreAtom } from "./core.atom";

export const ThemeAtom = focusAtom<IRootState, IThemeState>(CoreAtom, (optic) =>
  optic.prop("theme"),
);

ThemeAtom.debugLabel = "ThemeAtom";

export const DarkModeAtom = atom<boolean>(
  (get) => get(ThemeAtom).darkMode,
  (get, set, darkMode: boolean) => {
    // set the systemDefault to false if darkMode is set explicitly set
    set(ThemeAtom, { ...get(ThemeAtom), darkMode, systemDefault: false });
  },
);

DarkModeAtom.debugLabel = "DarkModeAtom";

export const SystemDefaultAtom = atom<boolean>(
  (get) => get(ThemeAtom).systemDefault,
  (get, set, systemDefault: boolean) => {
    // set the darkMode to false if systemDefault is set explicitly set
    set(ThemeAtom, { ...get(ThemeAtom), darkMode: false, systemDefault });
  },
);

SystemDefaultAtom.debugLabel = "SystemDefaultAtom";
