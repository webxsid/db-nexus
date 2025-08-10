import { IUserSettingsAtom } from "../types";

export const USER_SETTIGS_ATOM_KEY = "user-settings";
export const USER_SETTINGS_ATOM_DEFAULT: IUserSettingsAtom = {
  momentDataFormat: "YYYY-MM-DD HH:mm:ss (UTCZ)",
  enableTimezoneConversion: true,
  userTimezone: "Asia/Kolkata",
};
