import {
  IMongoConnectionParams,
  TMongoPasswordAuthMechanism,
  TMongoProxyMethod,
  TMongoReadPreference,
  TMongoScheme,
} from "@shared";
import qs from "query-string";
import { toast } from "react-toastify";
import { array, boolean, number, object, string } from "yup";

const mongoConnectionInit: IMongoConnectionParams = {
  general: {
    scheme: "mongodb",
    hosts: ["localhost:27017"],
    directConnection: false,
  },
  auth: {
    method: "none",
    passwordParams: {
      username: "",
      password: "",
      authDb: "",
      authMechanism: "DEFAULT",
    },
  },
  tls: {
    state: "Default",
    insecure: false,
    invalidHostNameAllowed: false,
    invalidCertificateAllowed: false,
  },
  proxy: {
    method: "None",
  },
  advanced: {
    readPreference: "Default",
  },
};

const mongoParamsValidator = (
  config: IMongoConnectionParams,
): IMongoConnectionParams => {
  const schema = object({
    general: object({
      scheme: string()
        .matches(/mongodb/)
        .required(),
      hosts: array().of(string()).required(),
      directConnection: boolean().required(),
    }).required(),
    auth: object({
      method: string()
        .matches(/none|password/)
        .required(),
      passwordParams: object().when("method", {
        is: (val: string) => val === "password",
        then: () =>
          object({
            username: string(),
            password: string(),
            authDb: string(),
            authMechanism: string()
              .matches(/DEFAULT|SCRAM-SHA-1|SCRAM-SHA-256/)
              .required(),
          }),
      }),
    }).required(),
    tls: object({
      state: string()
        .matches(/Default|Enabled|Disabled/)
        .required(),
      tlsParams: object({
        tlsCAFile: string(),
        tlsCertificateKeyFile: string(),
        tlsCertificateKeyFilePassword: string(),
      }),
      insecure: boolean(),
      invalidHostNameAllowed: boolean(),
      invalidCertificateAllowed: boolean(),
    }).required(),
    proxy: object({
      method: string()
        .matches(/None|SSH-Password|SSH-IdentityFile|Socks5/)
        .required(),
      proxyParams: object()
        .when("method", {
          is: (val: string) =>
            val !== "SSH-Password" && val !== "Socks5" && val !== "None",
          then: () =>
            object({
              proxyHost: string().required(),
              proxyPort: number().required(),
              proxyUsername: string().required(),
              proxyPassword: string(),
            }),
        })
        .when("method", {
          is: (val: string) => val === "SSH-IdentityFile",
          then: () =>
            object({
              proxyHost: string().required(),
              proxyPort: number().required(),
              proxyUsername: string().required(),
              proxyIdentityFile: string().required(),
              proxyIdentityFilePassword: string(),
            }),
        })
        .when("method", {
          is: (val: string) => val === "Socks5",
          then: () =>
            object({
              proxyHost: string(),
              proxyPort: number(),
              proxyUsername: string(),
              proxyPassword: string(),
            }),
        }),
    }).required(),
    advanced: object({
      readPreference: string()
        .matches(
          /Default|Primary|PrimaryPreferred|Secondary|SecondaryPreferred|Nearest/,
        )
        .required(),
      replicaSet: string(),
      authSource: string(),
      serverSelectionTimeout: number(),
      connectTimeout: number(),
      socketTimeout: number(),
      maxPoolSize: number(),
      minPoolSize: number(),
      maxIdleTimeMS: number(),
      waitQueueTimeoutMS: number(),
      heartbeatFrequencyMS: number(),
      appName: string(),
    }).required(),
  });

  return schema.validate(config) as unknown as IMongoConnectionParams;
};

const mongoURIGenerator = (config: IMongoConnectionParams): string => {
  const { general, auth, tls, proxy, advanced } = config;
  const { scheme, hosts, directConnection } = general;
  const { method, passwordParams } = auth;
  const {
    state: tlsState,
    tlsParams,
    insecure,
    invalidHostNameAllowed,
    invalidCertificateAllowed,
  } = tls;
  const { method: proxyMethod, proxyParams } = proxy;
  const {
    readPreference,
    replicaSet,
    authSource,
    serverSelectionTimeout,
    connectTimeout,
    socketTimeout,
    maxPoolSize,
    minPoolSize,
    maxIdleTimeMS,
    waitQueueTimeoutMS,
    heartbeatFrequencyMS,
    appName,
  } = advanced;

  try {
    mongoParamsValidator(config);
  } catch (error) {
    toast.error("Invalid config");
    console.error(error);
    throw new Error("Invalid config");
  }

  let uri = `${scheme}://`;
  if (method === "password") {
    if (passwordParams?.username) uri += `${passwordParams?.username}`;
    if (passwordParams?.password) uri += `:${passwordParams?.password}`;
    if (passwordParams?.username) uri += "@";
  }

  uri += `${hosts.join(",")}/`;
  if (authSource) uri += `${authSource}/`;
  const query = qs.stringify({
    ...(directConnection && { directConnection }),
    ...(auth.method === "password" && {
      authMechanism: passwordParams?.authMechanism,
      authSource: passwordParams?.authDb?.length
        ? passwordParams?.authDb
        : undefined,
    }),
    ...(tlsState !== "Default" && {
      tls: tlsState === "Enabled",
    }),
    ...(insecure && { tlsInsecure: insecure }),
    ...(invalidHostNameAllowed && {
      tlsAllowInvalidHostnames: invalidHostNameAllowed,
    }),
    ...(invalidCertificateAllowed && {
      tlsAllowInvalidCertificates: invalidCertificateAllowed,
    }),
    tlsCAFile: tlsParams?.tlsCAFile,
    tlsCertificateKeyFile: tlsParams?.tlsCertificateKeyFile,
    tlsCertificateKeyFilePassword: tlsParams?.tlsCertificateKeyFilePassword,
    ...(proxyMethod === "Socks5" && {
      proxyHost: proxyParams?.proxyHost,
      proxyPort: proxyParams?.proxyPort,
      proxyUsername: proxyParams?.proxyUsername,
      proxyPassword: proxyParams?.proxyPassword,
    }),
    ...(readPreference !== "Default" && { readPreference }),
    replicaSet,
    serverSelectionTimeout,
    connectTimeout,
    socketTimeout,
    maxPoolSize,
    minPoolSize,
    maxIdleTimeMS,
    waitQueueTimeoutMS,
    heartbeatFrequencyMS,
    appName,
  });

  return query?.length ? `${uri}?${query}` : uri;
};

const mongoConfigParser = (uri?: string): IMongoConnectionParams | null => {
  if (!uri) {
    return mongoConnectionInit;
  }
  const parsed = qs.parse(uri);
  const scheme = uri.split("://")[0];
  const hosts = uri.split("://")[1].split("/")[0].split(",");
  const { directConnection } = parsed;
  const auth: IMongoConnectionParams["auth"] = {
    method: parsed.authMechanism ? "password" : "none",
    passwordParams: {
      username: uri.split("://")[1]?.split("@")[1]?.split(":")[0] || "",
      password:
        uri.split("://")[1]?.split("@")[1]?.split(":")[1]?.split("@")[0] || "",
      authDb: parsed.authSource as string,
      authMechanism: parsed.authMechanism as TMongoPasswordAuthMechanism,
    },
  };
  const tls: IMongoConnectionParams["tls"] = {
    state: parsed.tls ? "Enabled" : "Default",
    tlsParams: {
      tlsCAFile: parsed.tlsCAFile as string,
      tlsCertificateKeyFile: parsed.tlsCertificateKeyFile as string,
      tlsCertificateKeyFilePassword:
        parsed.tlsCertificateKeyFilePassword as string,
    },
    insecure: parsed.tlsInsecure === "true",
    invalidHostNameAllowed: parsed.tlsAllowInvalidHostnames === "true",
    invalidCertificateAllowed: parsed.tlsAllowInvalidCertificates === "true",
  };
  const proxy: IMongoConnectionParams["proxy"] = {
    method: (parsed.proxyHost as TMongoProxyMethod) ? "Socks5" : "None",
    proxyParams: {
      proxyHost: parsed.proxyHost as string,
      proxyPort: parsed.proxyPort ? parseInt(parsed.proxyPort as string) : 0,
      proxyUsername: parsed.proxyUsername as string,
      proxyPassword: parsed.proxyPassword as string,
    },
  };
  const advanced: IMongoConnectionParams["advanced"] = {
    readPreference:
      (parsed.readPreference as TMongoReadPreference) || "Default",
    replicaSet: parsed.replicaSet as string,
    authSource: parsed.authSource as string,
    serverSelectionTimeout: parsed.serverSelectionTimeout
      ? parseInt(parsed.serverSelectionTimeout as string)
      : undefined,
    connectTimeout: parsed.connectTimeout
      ? parseInt(parsed.connectTimeout as string)
      : undefined,
    socketTimeout: parsed.socketTimeout
      ? parseInt(parsed.socketTimeout as string)
      : undefined,
    maxPoolSize: parsed.maxPoolSize
      ? parseInt(parsed.maxPoolSize as string)
      : undefined,
    minPoolSize: parsed.minPoolSize
      ? parseInt(parsed.minPoolSize as string)
      : undefined,
    maxIdleTimeMS: parsed.maxIdleTimeMS
      ? parseInt(parsed.maxIdleTimeMS as string)
      : undefined,
    waitQueueTimeoutMS: parsed.waitQueueTimeoutMS
      ? parseInt(parsed.waitQueueTimeoutMS as string)
      : undefined,
    heartbeatFrequencyMS: parsed.heartbeatFrequencyMS
      ? parseInt(parsed.heartbeatFrequencyMS as string)
      : undefined,
    appName: parsed.appName as string,
  };

  try {
    mongoParamsValidator({
      general: {
        scheme: scheme as TMongoScheme,
        hosts,
        directConnection: directConnection === "true",
      },
      auth,
      tls,
      proxy,
      advanced,
    });
    return {
      general: {
        scheme: scheme as TMongoScheme,
        hosts,
        directConnection: directConnection === "true",
      },
      auth,
      tls,
      proxy,
      advanced,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {
  mongoConfigParser,
  mongoConnectionInit,
  mongoParamsValidator,
  mongoURIGenerator,
};
