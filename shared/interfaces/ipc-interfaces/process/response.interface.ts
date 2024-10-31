/* global NodeJS */
export interface IWindowIpcEventsResponse {
  platform: {
    os: NodeJS.Platform;
    ok: 0 | 1;
  };
  version: {
    version: string;
    ok: 0 | 1;
  };
  isMac: {
    ok: 0 | 1;
  };
  isMaximized: {
    ok: 0 | 1;
  };
  isFullScreen: {
    ok: 0 | 1;
  };
}
