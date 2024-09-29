import { ESupportedDatabases } from "@shared";
import { EAppEvents } from "../constants";

export interface IAppEventPayloads {
  [EAppEvents.MainWindowCreated]: void;
  [EAppEvents.MainWindowClosed]: void;
  [EAppEvents.DatabaseWindowCreated]: {
    dbId: string;
    dbType: ESupportedDatabases;
  };
  [EAppEvents.DatabaseWindowClosed]: {
    dbId: string;
    dbType: ESupportedDatabases;
  };

  [EAppEvents.DatabaseConnectionAdded]: {
    dbId: string;
    dbType: ESupportedDatabases;
    connectionId: string;
  };
  [EAppEvents.DatabaseConnectionRemoved]: {
    dbId: string;
    dbType: ESupportedDatabases;
    connectionId: string;
  };
  [EAppEvents.DatabaseConnectionUpdated]: {
    dbId: string;
    dbType: ESupportedDatabases;
    connectionId: string;
  };

  [EAppEvents.DatabaseQueryExecutionStarted]: {
    dbId: string;
    dbType: ESupportedDatabases;
    connectionId: string;
    queryId: string;
  };
  [EAppEvents.DatabaseQueryExecutionCompleted]: {
    dbId: string;
    dbType: ESupportedDatabases;
    connectionId: string;
    queryId: string;
  };
  [EAppEvents.DatabaseQueryExecutionError]: {
    dbId: string;
    dbType: ESupportedDatabases;
    connectionId: string;
    queryId: string;
  };

  [EAppEvents.AggregationDefinitionUpdated]: {
    aggregationId: string;
  };
  [EAppEvents.AggregationExecutionStarted]: {
    aggregationId: string;
  };
  [EAppEvents.AggregationExecutionCompleted]: {
    aggregationId: string;
  };
  [EAppEvents.AggregationExecutionError]: {
    aggregationId: string;
  };

  [EAppEvents.UserSettingsChanged]: {
    setting: string;
    value: string;
  };
  [EAppEvents.UserThemeChanged]: {
    theme: string;
  };

  [EAppEvents.FileSaveStarted]: {
    filePath: string;
    data: string;
  };
  [EAppEvents.FileSaveCompleted]: {
    filePath: string;
  };
  [EAppEvents.FileSaveError]: {
    filePath: string;
  };
  [EAppEvents.FileLoadStarted]: {
    filePath: string;
  };
  [EAppEvents.FileLoadCompleted]: {
    filePath: string;
    data: string;
  };
  [EAppEvents.FileLoadError]: {
    filePath: string;
  };

  [EAppEvents.ProgressStarted]: {
    progressId: string;
  };
  [EAppEvents.ProgressUpdated]: {
    progressId: string;
    progress: number;
  };
  [EAppEvents.ProgressCompleted]: {
    progressId: string;
  };
  [EAppEvents.FeedbackReceived]: {
    feedback: string;
  };

  [EAppEvents.AppInitialized]: void;
  [EAppEvents.AppShutdown]: void;
  [EAppEvents.AppError]: {
    error: Error;
  };
}
