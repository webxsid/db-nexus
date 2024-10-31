import { EWindowIpcEvents } from "@shared/constants";

export interface IWindowIpcEventsPayload {
  [EWindowIpcEvents.Platform]: void;
  [EWindowIpcEvents.Version]: void;
  [EWindowIpcEvents.IsMac]: void;
}
