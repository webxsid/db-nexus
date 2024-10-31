import { CommandCentre, HotkeyButton } from "@/components/common";
import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";
import { CoreIpcEvents, MongoIpcEvents } from "@/ipc-events";
import { useDialogManager } from "@/managers";
import {
  EDialogIds,
  isEditConnectionAtom,
  selectedConnectionAtom,
} from "@/store";
import { mongoConnectionInit, mongoURIGenerator } from "@/utils/database/mongo";
import { Add, ArrowBack, Cancel, Settings } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ESupportedDatabases,
  IMongoConnection,
  IMongoConnectionParams,
} from "@shared";
import { useAtom, useAtomValue } from "jotai";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AuthConfig } from "./AuthConfig.MongoDB";
import { ConnectionConfigTabs, TabPanel } from "./ConnectionConfigTabs";
import { CustomizeMongoConnection } from "./Customize.MongoDb";
import { GeneralConfig } from "./GeneralConfig.MongoDB";

export interface IAddMongoDBConnectionDialogOptions {
  title: string;
  icon: ReactNode;
  handler: () => void;
}

export const AddMongoDbConnectionDialog = (): ReactNode => {
  const [isEdit, setIsEdit] = useAtom(isEditConnectionAtom);
  const selectedConnection = useAtomValue(selectedConnectionAtom);

  const [open, setOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [connectionName, setConnectionName] = useState<string>("");
  const [connectionColor, setConnectionColor] = useState<string>("");
  const [connectionUrl, setConnectionUrl] = useState<string>(
    "mongodb://localhost:27017",
  );
  const [showBack, setShowBack] = useState<boolean>(false);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState<boolean>(false);
  const [showCustomizeDb, setShowCustomizeDb] = useState<boolean>(false);
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

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("");

  const [config, setConfig] =
    useState<IMongoConnectionParams>(mongoConnectionInit);

  const handleClose = useCallback(() => {
    setConnectionUrl("");
    clearAllDialogs();
    setIsEdit(false);
  }, [clearAllDialogs, setIsEdit]);

  const closeCustomizeDb = useCallback(function closeCustomizeDb() {
    setShowCustomizeDb(false);
  }, []);

  useEffect(() => {
    setShowBack(hasHistory());
  }, [hasHistory]);

  useEffect(() => {
    const isOpen = isDialogOpen("addMongoConnection");
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedIndex(0);
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (isEdit && selectedConnection) {
      const { name, color, uri, connectionParams } = selectedConnection;
      setConnectionName(name);
      setConnectionColor(color);
      setConnectionUrl(uri);
      setGeneralConfig(connectionParams.general);
      setAuthConfig(connectionParams.auth);
    }
  }, [isEdit, selectedConnection]);

  const openGeneralTab = useCallback(() => {
    setSelectedTab(0);
  }, []);
  const openAuthTab = useCallback(() => {
    setSelectedTab(1);
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
    if (!connectionName || !connectionName.trim().length) {
      const name = `${generalConfig.scheme}-${generalConfig.hosts[0]}`;
      setConnectionName(name);
    }
  }, [connectionName, generalConfig]);

  const ccOptions = useMemo<IAddMongoDBConnectionDialogOptions[]>(
    () => [
      {
        title: isEdit
          ? `Update Connection: ${connectionUrl}`
          : `Save Connection: ${connectionUrl}`,
        icon: <Add />,
        handler: () => {
          setShowCustomizeDb(true);
        },
      },
      {
        title: "Advanced Config",
        icon: <Settings />,
        handler: toggleAdvancedConfig,
      },
      {
        title: "Cancel",
        icon: <Cancel />,
        handler: handleClose,
      },
    ],
    [connectionUrl, toggleAdvancedConfig, handleClose, isEdit],
  );

  const handleEnter = useCallback(
    function enterHandler() {
      console.log("Enter Handler");
      const option = ccOptions[selectedIndex - 1];
      console.log(option);
      if (option) {
        option.handler();
      }
    },
    [ccOptions, selectedIndex],
  );

  const handleArrowDown = useCallback(
    function arrowDownHandler() {
      setSelectedIndex((prev) => {
        if (prev === 0) {
          const inputField = document.getElementById(
            `${EDialogIds.AddMongoConnection}-search`,
          );
          if (inputField) {
            inputField.blur();
          }
        }
        if (prev !== ccOptions.length) {
          return prev + 1;
        }
      });
    },
    [ccOptions],
  );

  const handleArrowUp = useCallback(function arrowUpHandler() {
    setSelectedIndex((prev) => {
      if (prev === 1) {
        // focus on the input field
        const inputField = document.getElementById(
          `${EDialogIds.AddMongoConnection}-search`,
        );
        if (inputField) {
          inputField.focus();
        }
      }
      if (prev !== 0) {
        return prev - 1;
      }
    });
  }, []);

  const handleSaveConnection = async (): void => {
    setLoading(true);
    setLoadingText("Saving Connection...");
    const meta: IMongoConnection = {
      name: connectionName,
      color: connectionColor,
      connectionParams: config,
      uri: connectionUrl,
      provider: ESupportedDatabases.Mongo,
    };

    // test connection
    try {
      setLoadingText("Testing Connection...");
      const testResult = await MongoIpcEvents.testConnection(meta);
      console.log("Test Result", testResult);
      setLoadingText("Saving Connection...");
      if (!testResult.ok) throw new Error("Connection test failed");
      const saveResult = await CoreIpcEvents.addConnection(
        ESupportedDatabases.Mongo,
        meta,
      );
      if (!saveResult.ok) throw new Error("Failed to save connection");
      toast.success("Connection saved successfully");
      setLoading(false);
      clearAllDialogs();
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
      setLoadingText("");
    }
  };

  const handleUpdateConnection = async (): void => {
    setLoading(true);
    setLoadingText("Updating Connection...");
    const meta: IMongoConnection = {
      name: connectionName,
      color: connectionColor,
      connectionParams: config,
      uri: connectionUrl,
      provider: ESupportedDatabases.Mongo,
    };

    // test connection
    try {
      setLoadingText("Testing Connection...");
      const testResult = await MongoIpcEvents.testConnection(meta);
      console.log("Test Result", testResult);
      setLoadingText("Updating Connection...");
      if (!testResult.ok) throw new Error("Connection test failed");
      const saveResult = await CoreIpcEvents.updateConnection(
        ESupportedDatabases.Mongo,
        selectedConnection!.id,
        meta,
      );
      if (!saveResult.ok) throw new Error("Failed to update connection");
      toast.success("Connection updated successfully");
      setLoading(false);
      clearAllDialogs();
      setIsEdit(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
      setLoadingText("");
    }
  };

  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      general: generalConfig,
      auth: authConfig,
    }));
  }, [generalConfig, authConfig]);

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
      KeybindingManager.registerKeybinding(["Enter"], handleEnter);
    } else {
      KeybindingManager.unregisterKeybinding(["Meta+Shift+c"], handleClose);
      KeybindingManager.unregisterKeybinding(["Enter"], handleEnter);
    }

    return () => {
      KeybindingManager.unregisterKeybinding(["Ctrl+c"], handleClose);
      KeybindingManager.unregisterKeybinding(["Enter"], handleEnter);
    };
  }, [open, handleClose, openGeneralTab, openAuthTab, handleEnter]);

  useEffect(() => {
    if (showAdvancedConfig) {
      KeybindingManager.registerKeybinding(["Meta+1"], openGeneralTab);
      KeybindingManager.registerKeybinding(["Meta+2"], openAuthTab);
      KeybindingManager.unregisterKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.unregisterKeybinding(["ArrowUp"], handleArrowUp);
    } else {
      KeybindingManager.unregisterKeybinding(["Meta+1"], openGeneralTab);
      KeybindingManager.unregisterKeybinding(["Meta+2"], openAuthTab);
      KeybindingManager.registerKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.registerKeybinding(["ArrowUp"], handleArrowUp);
    }

    return () => {
      KeybindingManager.unregisterKeybinding(["Meta+1"], openGeneralTab);
      KeybindingManager.unregisterKeybinding(["Meta+2"], openAuthTab);
      KeybindingManager.unregisterKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.unregisterKeybinding(["ArrowUp"], handleArrowUp);
    };
  }, [
    showAdvancedConfig,
    openGeneralTab,
    openAuthTab,
    handleArrowDown,
    handleArrowUp,
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
              <IconButton
                onClick={() => {
                  closeDialog();
                  setIsEdit(false);
                }}
                size="small"
                sx={{ mr: 1 }}
              >
                <ArrowBack />
              </IconButton>
            ) : null}
          </Box>
        </InputAdornment>
      }
    >
      <Collapse
        in={!showAdvancedConfig && !showCustomizeDb && !loading}
        sx={{
          width: "100%",
          px: 1,
        }}
      >
        <List sx={{ width: "100%" }}>
          {ccOptions.map((option, index) => (
            <ListItemButton
              selected={selectedIndex === index + 1}
              key={index}
              sx={{
                borderRadius: 2,
                py: 1.5,
                border: "1px solid",
                borderColor: "transparent",
                backgroundColor: "transparent",
                color: "text.primary",
                my: 0.5,
                "&:hover": {
                  backgroundColor: `${theme.palette.primary.main}22`,
                },
              }}
              onClick={option.handler}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    aspectRatio: 1,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "primary.dark",
                    borderRadius: 2,
                    justifyContent: "center",
                    p: 1,
                  }}
                >
                  {option.icon}
                </Box>
              </ListItemIcon>
              <ListItemText primary={option.title} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
      <Collapse
        unmountOnExit
        in={showAdvancedConfig && !showCustomizeDb && !loading}
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
        <TabPanel value={selectedTab} index={1}>
          <AuthConfig
            isActive={selectedTab === 1}
            authConfig={authConfig}
            setAuthConfig={setAuthConfig}
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
            Use the <KeyCombo keyCombo="ArrowDown" size="smaller" /> &{" "}
            <KeyCombo keyCombo="ArrowUp" size="smaller" /> keys to navigate
            between fields
          </Typography>
          <HotkeyButton
            onClick={toggleAdvancedConfig}
            keyBindings={["Meta+Shift+a"]}
            showhotkey={"true"}
            tooltip="Close Advanced Config"
            sx={{ textTransform: "none" }}
          >
            Close Advanced Config
          </HotkeyButton>
        </Box>
      </Collapse>
      <Collapse
        unmountOnExit
        in={showCustomizeDb && !showAdvancedConfig && !loading}
        sx={{ width: "100%" }}
      >
        <CustomizeMongoConnection
          name={connectionName}
          color={connectionColor}
          setName={setConnectionName}
          setColor={setConnectionColor}
          isOpen={showCustomizeDb && !showAdvancedConfig && !loading}
        />
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
            Use the <KeyCombo keyCombo="ArrowDown" size="smaller" /> &{" "}
            <KeyCombo keyCombo="ArrowUp" size="smaller" /> keys to navigate
            between fields
          </Typography>
          <HotkeyButton
            onClick={closeCustomizeDb}
            keyBindings={["Meta+ArrowLeft"]}
            showhotkey={"true"}
            tooltip="Close Customization"
            disabled={loading}
            sx={{ textTransform: "none" }}
          >
            Back
          </HotkeyButton>
          <HotkeyButton
            variant="outlined"
            onClick={isEdit ? handleUpdateConnection : handleSaveConnection}
            keyBindings={["Meta+Enter"]}
            showhotkey={"true"}
            tooltip="Save Connection"
            disabled={loading}
            sx={{
              textTransform: "none",
              backgroundColor: `${theme.palette.primary.main}44`,
            }}
          >
            {isEdit ? "Update Connection" : "Save Connection"}
          </HotkeyButton>
        </Box>
      </Collapse>
      <Collapse in={loading} sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            width: "100%",
            px: 2,
            py: 2,
            backgroundColor: "secondary.main",
          }}
        >
          <CircularProgress
            size={24}
            variant="indeterminate"
            sx={{
              borderRadius: "50%",
            }}
          />
          <Typography variant="body1">{loadingText}</Typography>
        </Box>
      </Collapse>
    </CommandCentre>
  );
};
