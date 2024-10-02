import mongoDBImg from "@/assets/logos/mongodb.svg";
import { CommandCentre, HotkeyButton } from "@/components/common";
import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";
import { useDialogManager } from "@/managers";
import { EDialogIds } from "@/store";
import { mongoConnectionInit, mongoURIGenerator } from "@/utils/database/mongo";
import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
} from "@mui/material";
import { IMongoConnectionParams } from "@shared";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { ConnectionConfigTabs, TabPanel } from "./ConnectionConfigTabs";
import { GeneralConfig } from "./GeneralConfig.MongoDB";

export const AddMongoDbConnectionDialog = (): ReactNode => {
  const [open, setOpen] = useState<boolean>(false);
  const [connectionUrl, setConnectionUrl] = useState<string>(
    "mongodb://localhost:27017",
  );
  const [showBack, setShowBack] = useState<boolean>(false);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState<boolean>(false);
  const { hasHistory, closeDialog, isDialogOpen, clearAllDialogs } =
    useDialogManager();
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [generalConfig, setGeneralConfig] = useState<
    IMongoConnectionParams["general"]
  >(mongoConnectionInit.general);
  const [authConfig, setAuthConfig] = useState<IMongoConnectionParams["auth"]>(
    mongoConnectionInit.auth,
  );
  const [tlsConfig, setTlsConfig] = useState<IMongoConnectionParams["tls"]>(
    mongoConnectionInit.tls,
  );
  const [proxyConfig, setProxyConfig] = useState<
    IMongoConnectionParams["proxy"]
  >(mongoConnectionInit.proxy);
  const [advancedConfig, setAdvancedConfig] = useState<
    IMongoConnectionParams["advanced"]
  >(mongoConnectionInit.advanced);
  const [config, setConfig] =
    useState<IMongoConnectionParams>(mongoConnectionInit);

  const handleClose = useCallback(() => {
    setConnectionUrl("");
    clearAllDialogs();
  }, [clearAllDialogs]);

  useEffect(() => {
    setShowBack(hasHistory());
  }, [hasHistory]);

  useEffect(() => {
    setOpen(isDialogOpen("addMongoConnection"));
  }, [isDialogOpen]);

  const openGeneralTab = useCallback(() => {
    setSelectedTab(0);
  }, []);
  const openAuthTab = useCallback(() => {
    setSelectedTab(1);
  }, []);
  const openTlsTab = useCallback(() => {
    setSelectedTab(2);
  }, []);
  const openProxyTab = useCallback(() => {
    setSelectedTab(3);
  }, []);
  const openAdvancedTab = useCallback(() => {
    setSelectedTab(4);
  }, []);

  const toggleAdvancedConfig = useCallback(() => {
    console.log("Toggle Advanced Config");
    setShowAdvancedConfig((prev) => {
      console.log("Toggle Advanced Config");
      if (!prev) {
        setSelectedTab(0);
        // blur the input field
        const inputField = document.getElementById(
          `${EDialogIds.AddMongoConnection}-search`,
        );
        console.log(inputField);
        if (inputField) {
          inputField.blur();
        }
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    setConfig({
      general: generalConfig,
      auth: authConfig,
      tls: tlsConfig,
      proxy: proxyConfig,
      advanced: advancedConfig,
    });
  }, [generalConfig, authConfig, tlsConfig, proxyConfig, advancedConfig]);

  const generateAndSetUri = useCallback(async () => {
    const url = await mongoURIGenerator(config);
    setConnectionUrl(url);
  }, [config]);

  useEffect(() => {
    generateAndSetUri();
  }, [generateAndSetUri]);

  useEffect(() => {
    if (open) {
      KeybindingManager.registerKeybinding(["Meta+Shift+c"], handleClose);
      KeybindingManager.registerKeybinding(["Meta+1"], openGeneralTab);
      KeybindingManager.registerKeybinding(["Meta+2"], openAuthTab);
      KeybindingManager.registerKeybinding(["Meta+3"], openTlsTab);
      KeybindingManager.registerKeybinding(["Meta+4"], openProxyTab);
      KeybindingManager.registerKeybinding(["Meta+5"], openAdvancedTab);
    } else {
      KeybindingManager.unregisterKeybinding(["Meta+Shift+c"], handleClose);
      KeybindingManager.unregisterKeybinding(["Meta+1"], openGeneralTab);
      KeybindingManager.unregisterKeybinding(["Meta+2"], openAuthTab);
      KeybindingManager.unregisterKeybinding(["Meta+3"], openTlsTab);
      KeybindingManager.unregisterKeybinding(["Meta+4"], openProxyTab);
      KeybindingManager.unregisterKeybinding(["Meta+5"], openAdvancedTab);
    }

    return () => {
      KeybindingManager.unregisterKeybinding(["Ctrl+c"], handleClose);
      KeybindingManager.unregisterKeybinding(["Meta+1"], openGeneralTab);
      KeybindingManager.unregisterKeybinding(["Meta+2"], openAuthTab);
      KeybindingManager.unregisterKeybinding(["Meta+3"], openTlsTab);
      KeybindingManager.unregisterKeybinding(["Meta+4"], openProxyTab);
      KeybindingManager.unregisterKeybinding(["Meta+5"], openAdvancedTab);
    };
  }, [
    open,
    handleClose,
    openGeneralTab,
    openAuthTab,
    openTlsTab,
    openProxyTab,
    openAdvancedTab,
  ]);

  return (
    <CommandCentre
      textPlaceholder="Enter MongoDB connection string..."
      dialogType="addMongoConnection"
      keybindings={["Meta+m"]}
      text={connectionUrl}
      onTextChange={setConnectionUrl}
      startAdornment={
        <InputAdornment position="start">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {showBack ? (
              <IconButton onClick={closeDialog} size="small" sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
            ) : null}
            <img src={mongoDBImg} alt="MongoDB" height="24" />
          </Box>
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <HotkeyButton
            onClick={toggleAdvancedConfig}
            keyBindings={["Meta+Shift+a"]}
            showhotkey={"true"}
            tooltip="Toggle Advanced Config"
            sx={{ textTransform: "none" }}
          >
            Advanced config
          </HotkeyButton>
        </InputAdornment>
      }
    >
      <Collapse
        in={showAdvancedConfig}
        sx={{
          width: "100%",
        }}
      >
        <ConnectionConfigTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <TabPanel value={selectedTab} index={0}>
          <GeneralConfig
            isActive={selectedTab === 0}
            generalConfig={generalConfig}
            setGeneralConfig={setGeneralConfig}
          />
        </TabPanel>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            px: 2,
            py: 1,
            backgroundColor: "secondary.main",
          }}
        >
          <Typography
            variant="body1"
            sx={{ flexGrow: 1, display: "flex", gap: 1 }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "info.main" }}
            >
              Pro Tip
            </Typography>
            : Use the <KeyCombo keyCombo="Tab" size="smaller" /> &{" "}
            <KeyCombo keyCombo="Shift+Tab" size="smaller" /> keys to navigate
            between fields
          </Typography>
        </Box>
      </Collapse>
    </CommandCentre>
  );
};
