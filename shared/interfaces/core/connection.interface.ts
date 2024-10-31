import { ESupportedDatabases } from "../../constants";

/**
 * Represents a database connection with general properties applicable to various databases.
 */
export interface IDatabaseConnection<T> {
  /**
   * Unique identifier for the database connection instance.
   */
  id: string;

  /**
   * Optional human-readable name for the database connection instance.
   */
  name?: string;

  /**
   * Optional URI for the database connection. This can be useful for connection strings.
   */
  uri?: string;

  /**
   * Optional color code for visual representation in the UI.
   */
  color?: string;

  /**
   * The type of database, indicated by an enum.
   */
  provider: ESupportedDatabases;

  /**
   * Optional timestamp indicating when the database connection was created.
   */
  createdAt?: Date;

  /**
   * Optional timestamp indicating when the database connection was last updated.
   */
  updatedAt?: Date;

  /**
   * Optional timestamp for the last time the database was connected to.
   */
  lastConnectionAt?: Date;

  /**
   * Database-specific connection parameters.
   */
  connectionParams: T;
}
