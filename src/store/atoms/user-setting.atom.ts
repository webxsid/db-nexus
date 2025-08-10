import { atomWithStorage } from "jotai/utils";
import { USER_SETTIGS_ATOM_KEY, USER_SETTINGS_ATOM_DEFAULT } from "../constants";
import { IUserSettingsAtom } from "../types";
import { focusAtom } from "jotai-optics";

export const userSettingsAtom = atomWithStorage<IUserSettingsAtom>(
  USER_SETTIGS_ATOM_KEY,
  USER_SETTINGS_ATOM_DEFAULT
)

export const userDateFormatAtom = focusAtom(
  userSettingsAtom,
  (optic) => optic.prop("momentDataFormat")
)

export const timezoneConversaionEnabledAtom = focusAtom(
  userSettingsAtom,
  (optic) => optic.prop("enableTimezoneConversion")
)

export const userTimezoneAtom = focusAtom(
  userSettingsAtom,
  (optic) => optic.prop("userTimezone")
)

