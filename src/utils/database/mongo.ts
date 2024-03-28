import MongoDbConnectionParams from "@/store/types/database/mongo.types";
import qs from "query-string";
import { toast } from "react-toastify";
import { object, string, number, array, boolean } from "yup";

const mongoConnectionInit: MongoDbConnectionParams = {
  general: {
    scheme: "mongodb",
    hosts: ["localhost:27017"],
    directConnection: false,
  },
  auth: {
    method: "none",
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

const mongoParamsValidator = (config: MongoDbConnectionParams) => {
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
          is: (val: string) => val === "SSH-IdentityFile" && val !== "Socks5",
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
          /Default|Primary|PrimaryPreferred|Secondary|SecondaryPreferred|Nearest/
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

  return schema.validate(config);
};

const mongoURIGenerator = async (config: MongoDbConnectionParams) => {
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

  const isConfigValid = await mongoParamsValidator(config);
  if (isConfigValid.error) {
    toast.error(isConfigValid.error.message);
    throw new Error(isConfigValid.error.message);
  }

  let uri = `${scheme}://`;
  if (method === "password") {
    if (passwordParams?.username) uri += `${passwordParams?.username}`;
    if (passwordParams?.password) uri += `:${passwordParams?.password}`;
    if (passwordParams?.username) uri += "@";
  }

  uri += `${hosts.join(",")}/`;
  if (authSource) uri += `${authSource}/`;
  const query = await qs.stringify({
    ...(directConnection && { directConnection }),
    ...(auth.method === "password" && {
      authMechanism: passwordParams?.authMechanism,
      authSource: passwordParams?.authDb?.length
        ? passwordParams?.authDb
        : undefined,
    }),
    ...(tlsState !== "Default" && {
      tls: tlsState === "Enabled" ? true : false,
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

  const finalURI = query?.length ? `${uri}?${query}` : uri;
  return finalURI;
};

const mongoConfigParser = (uri: string) => {
  const parsed = qs.parse(uri);
  const scheme = uri.split("://")[0];
  const hosts = uri.split("://")[1].split("/")[0].split(",");
  const { directConnection } = parsed;
  const auth = {
    method: parsed.authMechanism ? "password" : "none",
    passwordParams: {
      username: uri.split("://")[1]?.split("@")[1]?.split(":")[0] || "",
      password:
        uri.split("://")[1]?.split("@")[1]?.split(":")[1]?.split("@")[0] || "",
      authDb: parsed.authSource,
      authMechanism: parsed.authMechanism,
    },
  };
  const tls = {
    state: parsed.tls ? "Enabled" : "Default",
    tlsParams: {
      tlsCAFile: parsed.tlsCAFile,
      tlsCertificateKeyFile: parsed.tlsCertificateKeyFile,
      tlsCertificateKeyFilePassword: parsed.tlsCertificateKeyFilePassword,
    },
    insecure: parsed.tlsInsecure,
    invalidHostNameAllowed: parsed.tlsAllowInvalidHostnames,
    invalidCertificateAllowed: parsed.tlsAllowInvalidCertificates || undefined,
  };
  const proxy = {
    method: parsed.proxyHost ? "Socks5" : "None",
    proxyParams: {
      proxyHost: parsed.proxyHost,
      proxyPort: parsed.proxyPort,
      proxyUsername: parsed.proxyUsername,
      proxyPassword: parsed.proxyPassword,
    },
  };
  const advanced = {
    readPreference: parsed.readPreference || "Default",
    replicaSet: parsed.replicaSet,
    authSource: parsed.authSource,
    serverSelectionTimeout: parsed.serverSelectionTimeout,
    connectTimeout: parsed.connectTimeout,
    socketTimeout: parsed.socketTimeout,
    maxPoolSize: parsed.maxPoolSize,
    minPoolSize: parsed.minPoolSize,
    maxIdleTimeMS: parsed.maxIdleTimeMS,
    waitQueueTimeoutMS: parsed.waitQueueTimeoutMS,
    heartbeatFrequencyMS: parsed.heartbeatFrequencyMS,
    appName: parsed.appName,
  };

  const isConfigValid = mongoParamsValidator({
    general: { scheme, hosts, directConnection: directConnection || false },
    auth,
    tls,
    proxy,
    advanced,
  });

  if (isConfigValid.error) {
    throw new Error(isConfigValid.error.message);
  }

  return {
    general: { scheme, hosts, directConnection: directConnection || false },
    auth,
    tls,
    proxy,
    advanced,
  };
};

export {
  mongoConnectionInit,
  mongoParamsValidator,
  mongoURIGenerator,
  mongoConfigParser,
};