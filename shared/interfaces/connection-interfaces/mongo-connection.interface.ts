import { IDatabaseConnection } from "../core";
export type TMongoScheme = "mongodb" | "mongodb+srv";
export type TMongoAuthMethods = "none" | "password";
export type TMongoPasswordAuthMechanism =
  | "DEFAULT"
  | "SCRAM-SHA-1"
  | "SCRAM-SHA-256";
export type TMongoTLSState = "Default" | "Enabled" | "Disabled";
export type TMongoProxyMethod =
  | "None"
  | "SSH-Password"
  | "SSH-IdentityFile"
  | "Socks5";
export type TMongoReadPreference =
  | "Default"
  | "Primary"
  | "PrimaryPreferred"
  | "Secondary"
  | "SecondaryPreferred"
  | "Nearest";
export interface IMongoConnectionParams {
  general: {
    scheme: TMongoScheme;
    hosts: string[];
    directConnection: boolean;
  };
  auth: {
    method: TMongoAuthMethods;
    passwordParams?: {
      username?: string;
      password?: string;
      authDb?: string;
      authMechanism?: TMongoPasswordAuthMechanism;
    };
  };
  tls: {
    state: TMongoTLSState;
    tlsParams?: {
      tlsCAFile?: string;
      tlsCertificateKeyFile?: string;
      tlsCertificateKeyFilePassword?: string;
    };
    insecure?: boolean;
    invalidHostNameAllowed?: boolean;
    invalidCertificateAllowed?: boolean;
  };
  proxy: {
    method: TMongoProxyMethod;
    proxyParams?: {
      proxyHost?: string;
      proxyPort?: number;
      proxyUsername?: string;
      proxyPassword?: string;
      proxyIdentityFile?: string;
      proxyIdentityFilePassword?: string;
    };
  };
  advanced: {
    readPreference: TMongoReadPreference;
    replicaSet?: string;
    authSource?: string;
    serverSelectionTimeout?: number;
    connectTimeout?: number;
    socketTimeout?: number;
    maxPoolSize?: number;
    minPoolSize?: number;
    maxIdleTimeMS?: number;
    waitQueueTimeoutMS?: number;
    heartbeatFrequencyMS?: number;
    appName?: string;
  };
}

export interface IMongoConnection
  extends IDatabaseConnection<IMongoConnectionParams> {
  enableMongoose?: boolean;
}

export type TMongoConnectionStatus = "connected" | "disconnected" | "warning" | "critical";

export type TMongoConnectionType = "Standalone" | "ReplicaSet" | "Sharded" | "Unknown";

export interface IMongoConnectionServerStats {
  memory: {
    total: number;
    used: number;
    free: number;
  }
  cpu: {
    usage: number;
  }
  connections: {
    current: number;
    available: number;
  }
  network: {
    in: number;
    out: number;
  },
  version: string;
  connectionType: TMongoConnectionType
}

export interface IMongoConnectionOpsStats {
  insert: number;
  query: number;
  update: number;
  delete: number;
  getmore: number;
  command: number;
}

export interface IMongoConnectionStats {
  connectionStatus: TMongoConnectionStatus;
  connectionLatency: number;
  serverStats: IMongoConnectionServerStats;
  opsStats: IMongoConnectionOpsStats;
}