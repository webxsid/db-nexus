import { atomWithStorage } from "jotai/utils";
import IRootState from "../types";

export const CoreAtom = atomWithStorage<IRootState>("core", {
  theme: {
    darkMode: true,
    systemDefault: false,
  },
  loading: {
    active: false,
    reason: "",
    message: "",
  },
} as IRootState);

CoreAtom.debugLabel = "CoreAtom";
