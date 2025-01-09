import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { CoreAtom } from "@/store";

export const ThemeAtom = focusAtom(CoreAtom, (optic) =>
  optic.prop("theme"),
);

ThemeAtom.debugLabel = "ThemeAtom";

export const DarkModeAtom = atom(
  (get) => get(ThemeAtom).darkMode,
  (get, set, darkMode: boolean) => {
    set(ThemeAtom, { ...get(ThemeAtom), darkMode, systemDefault: false });
  }
);

DarkModeAtom.debugLabel = "DarkModeAtom";

export const SystemDefaultAtom = atom(
  (get) => get(ThemeAtom).systemDefault,
  (get, set, systemDefault: boolean) => {
    set(ThemeAtom, { ...get(ThemeAtom), darkMode: false, systemDefault });
  }
);

SystemDefaultAtom.debugLabel = "SystemDefaultAtom";
