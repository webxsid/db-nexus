import { MongoDatabaseState } from ".";

type MongoScheme = "mongodb" | "mongodb+srv";
type MongoAuthMethods = "none" | "password";
type MongoPasswordAuthMechanism = "DEFAULT" | "SCRAM-SHA-1" | "SCRAM-SHA-256";
type MongoTLSState = "Default" | "Enabled" | "Disabled";
type MongoProxyMethod = "None" | "SSH-Password" | "SSH-IdentityFile" | "Socks5";
type MongoReadPreference =
  | "Default"
  | "Primary"
  | "PrimaryPreferred"
  | "Secondary"
  | "SecondaryPreferred"
  | "Nearest";

interface MongoDbConnectionParams {
  general: {
    scheme: MongoScheme;
    hosts: string[];
    directConnection: boolean;
  };
  auth: {
    method: MongoAuthMethods;
    passwordParams?: {
      username: string;
      password: string;
      authDb?: string;
      authMechanism: MongoPasswordAuthMechanism;
    };
  };
  tls: {
    state: MongoTLSState;
    tlsParams?: {
      tlsCAFile: string;
      tlsCertificateKeyFile?: string;
      tlsCertificateKeyFilePassword?: string;
    };
    insecure: boolean;
    invalidHostNameAllowed: boolean;
    invalidCertificateAllowed: boolean;
  };
  proxy: {
    method: MongoProxyMethod;
    proxyParams?: {
      proxyHost: string;
      proxyPort: number;
      proxyUsername?: string;
      proxyPassword?: string;
      proxyIdentityFile?: string;
      proxyIdentityFilePassword?: string;
    };
  };
  advanced: {
    readPreference: MongoReadPreference;
    replicaSet?: string;
    authSource?: string;
    serverSelectionTimeout?: number;
    connectTimeout?: number;
    socketTimeout?: number;
    maxPoolSize?: number;
    minPoolSize?: number;
    maxIdleTimeMS?: number;
    maxIdleTimeMS?: number;
    waitQueueTimeoutMS?: number;
    heartbeatFrequencyMS?: number;
    appName?: string;
  };
}

enum MongoActionTypes {
  ADD_DATABASE = "ADD_DATABASE_MONGO",
  REMOVE_DATABASE = "REMOVE_DATABASE_MONGO",
  UPDATE_DATABASE = "UPDATE_DATABASE_MONGO",
}

type MongoActionPayload = MongoDatabaseState | string;

interface MongoAction {
  type: MongoActionTypes;
  payload: MongoActionPayload;
}

export {
  MongoScheme,
  MongoAuthMethods,
  MongoPasswordAuthMechanism,
  MongoTLSState,
  MongoProxyMethod,
  MongoReadPreference,
  MongoActionTypes,
  MongoActionPayload,
  MongoAction,
};

export default MongoDbConnectionParams;
