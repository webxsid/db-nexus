import React from "react";
import MongoDbConnectionParams from "@/store/types/database/mongo.types";
import {
  mongoConnectionInit,
  mongoConfigParser,
  mongoURIGenerator,
} from "@/utils/database/mongo";
import {
  Box,
  TextField,
  Tabs,
  Tab,
  Collapse,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import {
  MongoDatabaseState,
  DatabaseConfig as _DataBaseCOnfig,
} from "@/store/types";
import { ChevronRight } from "@mui/icons-material";
import GeneralConfig from "./GeneralConfig";
import AuthConfig from "./AuthConfig";
import TLSConfig from "./TLSConfig";
import ProxyConfig from "./ProxyConfig";
import { v4 as uuidV4 } from "uuid";
import { SupportedDatabases } from "@/components/common/types";
import { toast } from "react-toastify";

const TabPanel: React.FC<{
  value: number;
  index: number;
  children: React.ReactNode;
}> = ({ value, index, children }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box
          sx={{
            py: 2,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};

interface Props {
  handleNext?: (dbState: MongoDatabaseState) => void;
  handlePrevious?: () => void;
}

const MongoDBConfig: React.FC<Props> = ({ handleNext, handlePrevious }) => {
  const [config, setConfig] =
    React.useState<MongoDbConnectionParams>(mongoConnectionInit);
  const [uri, setUri] = React.useState<string>("");
  const [tab, setTab] = React.useState<number>(0);
  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false);

  const handleURIChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUri(e.target.value);
    const parsedConfig = await mongoConfigParser(e.target.value);
    if (parsedConfig) setConfig(parsedConfig);
    else toast.error("Invalid URI");
  };

  const handleChangeGeneralConfig = (
    newConfig: MongoDbConnectionParams["general"]
  ) => {
    setConfig({
      ...config,
      general: newConfig,
    });
  };

  const handleChangeAuthConfig = (
    newConfig: MongoDbConnectionParams["auth"]
  ) => {
    setConfig({
      ...config,
      auth: newConfig,
    });
  };

  const handleChangeTLSConfig = (newConfig: MongoDbConnectionParams["tls"]) => {
    setConfig({
      ...config,
      tls: newConfig,
    });
  };

  const handleChangeProxyConfig = (
    newConfig: MongoDbConnectionParams["proxy"]
  ) => {
    setConfig({
      ...config,
      proxy: newConfig,
    });
  };

  const generateAndSetUri = React.useCallback(async () => {
    const url = await mongoURIGenerator(config);
    setUri(url);
  }, [config]);

  const handleChangeConfig = (key: string) => {
    switch (key) {
      case "general":
        return handleChangeGeneralConfig;
      case "auth":
        return handleChangeAuthConfig;
      case "tls":
        return handleChangeTLSConfig;
      case "proxy":
        return handleChangeProxyConfig;
      default:
        throw new Error("Invalid key");
    }
  };

  React.useEffect(() => {
    generateAndSetUri();
  }, [generateAndSetUri]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 3,
          }}
        >
          <TextField
            value={uri}
            label="Connection URI"
            fullWidth
            multiline
            onChange={handleURIChange}
            minRows={1}
            maxRows={5}
            sx={{
              "& fieldset": {
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box>
          <Button
            variant="text"
            disableElevation
            disableRipple
            startIcon={
              <ChevronRight
                sx={{
                  transform: `rotate(${showAdvanced ? 90 : 0}deg)`,
                }}
              />
            }
            onClick={() => setShowAdvanced(!showAdvanced)}
            sx={{
              textTransform: "none",
              color: "primary.main",
              mb: 1,
            }}
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>
          <Collapse in={showAdvanced}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                pt: 1,
                pb: 3,
              }}
            >
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "primary.main",
                    height: "60%",
                    transform: "translateY(-35%)",
                    borderRadius: 4,
                    color: "primary.contrastText",
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    minWidth: "unset",
                    padding: "6px 12px",
                    mr: 2,
                    color: "text.secondary",
                    "&.Mui-selected": {
                      zIndex: 1,
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <Tab label="General" />
                <Tab label="Auth" />
                <Tab label="TLS" />
                <Tab label="Proxy" />
                {/* <Tab label="Advanced" /> */}
              </Tabs>
              <Divider />
              <TabPanel value={tab} index={0}>
                <GeneralConfig
                  generalConfig={config.general}
                  setGeneralConfig={
                    handleChangeConfig(
                      "general"
                    ) as typeof handleChangeGeneralConfig
                  }
                />
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <AuthConfig
                  authConfig={config.auth}
                  setAuthConfig={
                    handleChangeConfig("auth") as typeof handleChangeAuthConfig
                  }
                />
              </TabPanel>
              <TabPanel value={tab} index={2}>
                <TLSConfig
                  tlsConfig={config.tls}
                  setTlsConfig={
                    handleChangeConfig("tls") as typeof handleChangeTLSConfig
                  }
                />
              </TabPanel>
              <TabPanel value={tab} index={3}>
                <ProxyConfig
                  proxyConfig={config.proxy}
                  setProxyConfig={
                    handleChangeConfig(
                      "proxy"
                    ) as typeof handleChangeProxyConfig
                  }
                />
              </TabPanel>
            </Box>
          </Collapse>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            mt: 2,
          }}
        >
          <Button
            variant="text"
            color="primary"
            disableElevation
            disableRipple
            onClick={handlePrevious}
            sx={{ borderRadius: 3 }}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disableRipple
            onClick={() => {
              handleNext &&
                handleNext({
                  id: uuidV4(),
                  uri,
                  provider: SupportedDatabases.MONGO,
                  connectionParams: config,
                });
            }}
            endIcon={<ChevronRight />}
            sx={{ borderRadius: 3 }}
          >
            Test Connection
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export type MongoDBConfigComponent = React.FC<Props>;
export default MongoDBConfig;
