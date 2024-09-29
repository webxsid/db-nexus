export enum EAppEventListenerChannels {
  Window = "WINDOW",
  Database = "DATABASE",
  // Add more channels as needed
}

// shared/constants/EAppEvents.ts

export enum EAppEvents {
  // Window Management
  MainWindowCreated = "MainWindowCreated",
  MainWindowClosed = "MainWindowClosed",
  DatabaseWindowCreated = "DatabaseWindowCreated",
  DatabaseWindowClosed = "DatabaseWindowClosed",

  // Database Connection
  DatabaseConnectionAdded = "DatabaseConnectionAdded",
  DatabaseConnectionRemoved = "DatabaseConnectionRemoved",
  DatabaseConnectionUpdated = "DatabaseConnectionUpdated",

  // Database Operations
  DatabaseQueryExecutionStarted = "DatabaseQueryExecutionStarted",
  DatabaseQueryExecutionCompleted = "DatabaseQueryExecutionCompleted",
  DatabaseQueryExecutionError = "DatabaseQueryExecutionError",

  // Aggregation
  AggregationDefinitionUpdated = "AggregationDefinitionUpdated",
  AggregationExecutionStarted = "AggregationExecutionStarted",
  AggregationExecutionCompleted = "AggregationExecutionCompleted",
  AggregationExecutionError = "AggregationExecutionError",

  // User Settings
  UserSettingsChanged = "UserSettingsChanged",
  UserThemeChanged = "UserThemeChanged",

  // File Operations
  FileSaveStarted = "FileSaveStarted",
  FileSaveCompleted = "FileSaveCompleted",
  FileSaveError = "FileSaveError",
  FileLoadStarted = "FileLoadStarted",
  FileLoadCompleted = "FileLoadCompleted",
  FileLoadError = "FileLoadError",

  // Feedback and Progress
  ProgressStarted = "ProgressStarted",
  ProgressUpdated = "ProgressUpdated",
  ProgressCompleted = "ProgressCompleted",
  FeedbackReceived = "FeedbackReceived",

  // App Lifecycle
  AppInitialized = "AppInitialized",
  AppShutdown = "AppShutdown",
  AppError = "AppError",
}
