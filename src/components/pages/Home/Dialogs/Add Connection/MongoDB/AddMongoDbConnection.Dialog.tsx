import mongoDBImg from "@/assets/logos/mongodb.svg";
import { CommandCentre } from "@/components/common";
import { useDialogManager, useKeybindingManager } from "@/managers";
import { EDialogIds } from "@/store";
import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { IMongoConnectionParams } from "@shared";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { ConnectionConfigTabs, TabPanel } from "./ConnectionConfigTabs";
import { GeneralConfig } from "./GeneralConfig.MongoDB";

export const AddMongoDbConnectionDialog = (): ReactNode => {
  const [open, setOpen] = useState<boolean>(false);
  const [connectionUrl, setConnectionUrl] = useState<string>("");
  const [showBack, setShowBack] = useState<boolean>(false);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState<boolean>(false);
  const { hasHistory, closeDialog, isDialogOpen, clearAllDialogs } =
    useDialogManager();
  const { registerKeybinding, unregisterKeybinding, getKeyComboIcons } =
    useKeybindingManager();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [generalConfig, setGeneralConfig] = useState<
    IMongoConnectionParams["general"]
  >({
    hosts: ["localhost:27017"],
    scheme: "mongodb",
    directConnection: true,
  });

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
    setShowAdvancedConfig((prev) => {
      if (prev) {
        setSelectedTab(0);
        // blur the input field
        const inputField = document.getElementById(
          `connection-${EDialogIds.AddMongoConnection}}`,
        );
        if (inputField) {
          inputField.blur();
        }
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    if (open) {
      registerKeybinding(["Meta+Shift+c"], handleClose);
      registerKeybinding(["Meta+1"], openGeneralTab);
      registerKeybinding(["Meta+2"], openAuthTab);
      registerKeybinding(["Meta+3"], openTlsTab);
      registerKeybinding(["Meta+4"], openProxyTab);
      registerKeybinding(["Meta+5"], openAdvancedTab);
      registerKeybinding(["Shift+Tab"], toggleAdvancedConfig);
    } else {
      unregisterKeybinding(["Meta+Shift+c"], handleClose);
      unregisterKeybinding(["Meta+1"], openGeneralTab);
      unregisterKeybinding(["Meta+2"], openAuthTab);
      unregisterKeybinding(["Meta+3"], openTlsTab);
      unregisterKeybinding(["Meta+4"], openProxyTab);
      unregisterKeybinding(["Meta+5"], openAdvancedTab);
      unregisterKeybinding(["Shift+Tab"], toggleAdvancedConfig);
    }

    return () => {
      unregisterKeybinding(["Ctrl+c"], handleClose);
      unregisterKeybinding(["Meta+1"], openGeneralTab);
      unregisterKeybinding(["Meta+2"], openAuthTab);
      unregisterKeybinding(["Meta+3"], openTlsTab);
      unregisterKeybinding(["Meta+4"], openProxyTab);
      unregisterKeybinding(["Meta+5"], openAdvancedTab);
      unregisterKeybinding(["Shift+Tab"], toggleAdvancedConfig);
    };
  }, [
    open,
    handleClose,
    registerKeybinding,
    unregisterKeybinding,
    openGeneralTab,
    openAuthTab,
    openTlsTab,
    openProxyTab,
    openAdvancedTab,
    toggleAdvancedConfig,
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
          <Typography
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {getKeyComboIcons("Shift+Tab", "small")} to Advanced Config
          </Typography>
        </InputAdornment>
      }
    >
      <Collapse in={showAdvancedConfig}>
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
      </Collapse>
    </CommandCentre>
  );
};
