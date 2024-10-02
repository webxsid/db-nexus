import { TransparentTextField } from "@/components/common";
import Render from "@/components/common/Render";
import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";
import { useTheme } from "@emotion/react";
import { Info } from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { IMongoConnectionParams, TMongoScheme } from "@shared";
import React, {
  FC,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";

const schemeInfo = {
  mongodb:
    "Standard Connection String Format. The standard format of the MongoDB connection URI is used to connect to a MongoDB deployment: standalone, replica set, or a sharded cluster.",
  "mongodb+srv":
    "DNS Seed List Connection Format. The +srv indicates to the client that the hostname that follows corresponds to a DNS SRV record.",
};

interface IProps {
  isActive: boolean;
  generalConfig: IMongoConnectionParams["general"];
  setGeneralConfig: (config: IMongoConnectionParams["general"]) => void;
}

export const GeneralConfig: FC<IProps> = ({
  isActive,
  generalConfig,
  setGeneralConfig,
}): ReactNode => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [maxIndex, _setMaxIndex] = React.useState<number>(2);
  const [skipDirectConnection, setSkipDirectConnection] =
    React.useState<boolean>(false);
  const theme = useTheme();
  const [newHost, setNewHost] = React.useState<string>("");

  const schemeRef = useRef<HTMLDivElement>(null);
  const directConnectionRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  const focusSchemeRef = useCallback(function schemeRefFocus(): void {
    schemeRef.current?.focus();
  }, []);
  const _focusDirectConnectionRef = useCallback(
    function directConnectionRefFocus(): void {
      directConnectionRef.current?.focus();
    },
    [],
  );
  const _focusHostRef = useCallback(function hostRefFocus(): void {
    const input = hostRef.current?.querySelector("input");
    input?.focus();
  }, []);

  const selectMongoScheme = useCallback(
    (scheme: string): void => {
      setGeneralConfig({
        ...generalConfig,
        hosts: ["localhost:27017"],
        scheme: scheme as TMongoScheme,
      });
      if (scheme === "mongodb+srv") {
        setGeneralConfig({
          ...generalConfig,
          scheme,
          hosts: ["localhost"],
          directConnection: false,
        });
      }
    },
    [generalConfig, setGeneralConfig],
  );

  const toggleMongoScheme = useCallback(() => {
    console.log("Toggle Mongo Scheme");
    setGeneralConfig((prev) => {
      console.log("Toggle Mongo Scheme", prev);
      return {
        ...prev,
        scheme: prev.scheme === "mongodb" ? "mongodb+srv" : "mongodb",
        hosts: prev.scheme === "mongodb" ? ["localhost"] : ["localhost:27017"],
        directConnection: prev.scheme === "mongodb",
      };
    });
  }, [setGeneralConfig]);

  const toggleDirectConnection = useCallback(() => {
    setGeneralConfig((prev) => ({
      ...prev,
      directConnection: !prev.directConnection,
    }));
  }, [setGeneralConfig]);

  const handleSchemeSpace = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        toggleMongoScheme();
      }
    },
    [toggleMongoScheme],
  );

  const handleDirectConnectionSpace = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        toggleDirectConnection();
      }
    },
    [toggleDirectConnection],
  );

  const handleNext = useCallback(() => {
    if (selectedIndex < maxIndex) {
      if ((selectedIndex === 0) & skipDirectConnection) {
        setSelectedIndex(selectedIndex + 2);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    }
  }, [selectedIndex, maxIndex, skipDirectConnection]);

  const handlePrev = useCallback(() => {
    if (selectedIndex > 0) {
      if ((selectedIndex === 2) & skipDirectConnection) {
        setSelectedIndex(selectedIndex - 2);
      } else {
        setSelectedIndex(selectedIndex - 1);
      }
    }
  }, [selectedIndex, skipDirectConnection]);

  const handleTab = useCallback(
    function tabHandler(event: SyntheticEvent): void {
      event.preventDefault();
      handleNext();
    },
    [handleNext],
  );

  const handleShiftTab = useCallback(
    function shiftTabHandler(event: SyntheticEvent): void {
      event.preventDefault();
      handlePrev();
    },
    [handlePrev],
  );

  useEffect(() => {
    if (isActive) {
      KeybindingManager.registerKeybinding(["Tab"], handleTab);
      KeybindingManager.registerKeybinding(["Shift+Tab"], handleShiftTab);
    } else {
      KeybindingManager.unregisterKeybinding(["Tab"], handleTab);
      KeybindingManager.unregisterKeybinding(["Shift+Tab"], handleShiftTab);
    }
  }, [isActive, handleTab, handleShiftTab]);

  useEffect(() => {
    const currentRef =
      selectedIndex === 0
        ? schemeRef
        : selectedIndex === 1
          ? directConnectionRef
          : hostRef;
    currentRef.current?.focus();

    if (selectedIndex === 2) {
      const input = hostRef.current?.querySelector("input");
      input?.focus();
    }

    const spaceHandler =
      selectedIndex === 0
        ? handleSchemeSpace
        : selectedIndex === 1
          ? handleDirectConnectionSpace
          : undefined;

    if (spaceHandler) {
      console.log("Adding Event Listener");
      currentRef.current?.addEventListener("keydown", spaceHandler);
    }

    return () => {
      currentRef.current?.removeEventListener("keydown", spaceHandler);
    };
  }, [
    selectedIndex,
    handleSchemeSpace,
    handleDirectConnectionSpace,
    schemeRef,
    directConnectionRef,
    hostRef,
  ]);

  useEffect(() => {
    if (generalConfig.scheme === "mongodb+srv") {
      setSkipDirectConnection(true);
    } else {
      setSkipDirectConnection(false);
    }
  }, [generalConfig.scheme]);

  useEffect(() => {
    if (isActive) {
      setSelectedIndex(0);
    }
  }, [isActive]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isActive) {
        focusSchemeRef();
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isActive, focusSchemeRef]);

  return (
    <List sx={{ width: "100%" }}>
      <ListItemButton
        ref={schemeRef}
        selected={selectedIndex === 0}
        onClick={() => setSelectedIndex(0)}
        sx={{
          borderRadius: 2,
          py: 1.5,
          pb: selectedIndex === 0 ? 4 : 1.5,
          border: "1px solid",
          borderColor: "transparent",
          backgroundColor: "transparent",
          color: "text.primary",
          my: 0.5,
          "&:hover": {
            backgroundColor: `${theme.palette.primary.main}22`,
          },
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: selectedIndex === 0 ? "flex" : "none",
            alignItems: "center",
            gap: 1,
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "background.default",
            px: 1,
            py: 0.5,
            borderRadius: 2,
          }}
        >
          <KeyCombo keyCombo="Space" size="smaller" />
          <Typography variant="body2">to toggle</Typography>
        </Box>
        <ListItemText
          primary={
            <Box
              component={"span"}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography component={"span"} variant="body1">
                Connection String Scheme
              </Typography>
              <Tabs
                value={generalConfig.scheme}
                onChange={toggleMongoScheme}
                sx={{
                  backgroundColor: "background.default",
                  borderRadius: 2,
                  px: 1,
                }}
              >
                <Tab label="mongodb" value="mongodb" />
                <Tab label="mongodb+srv" value="mongodb+srv" />
              </Tabs>
            </Box>
          }
          secondary={
            <Box
              sx={{
                mt: 2,
                pl: 1,
                display: selectedIndex === 0 ? "block" : "none",
              }}
              component={"span"}
            >
              <Typography
                component={"span"}
                variant="body2"
                sx={{ color: "text.secondary", display: "flex", gap: 1 }}
              >
                <Info sx={{ fontSize: 20 }} />
                {schemeInfo[generalConfig.scheme]}
              </Typography>
            </Box>
          }
        />
      </ListItemButton>
      <Divider />
      <Render
        if={generalConfig.scheme === "mongodb"}
        then={
          <>
            <ListItemButton
              onClick={() => setSelectedIndex(1)}
              ref={directConnectionRef}
              selected={selectedIndex === 1}
              sx={{
                borderRadius: 2,
                py: 1.5,
                pb: selectedIndex === 1 ? 4 : 1.5,
                border: "1px solid",
                borderColor: "transparent",
                backgroundColor: "transparent",
                color: "text.primary",
                my: 0.5,
                "&:hover": {
                  backgroundColor: `${theme.palette.primary.main}22`,
                },
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: selectedIndex === 1 ? "flex" : "none",
                  alignItems: "center",
                  gap: 1,
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "background.paper",
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  visibility: selectedIndex === 1 ? "visible" : "hidden",
                }}
              >
                <KeyCombo keyCombo="Space" size="smaller" />
                <Typography variant="body2"> to toggle</Typography>
              </Box>
              <ListItemText
                primary={
                  <Box
                    component={"span"}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component={"span"} variant="body1">
                      Direct Connection
                    </Typography>
                    <Tabs
                      value={`${generalConfig.directConnection}`}
                      onChange={toggleDirectConnection}
                      sx={{
                        backgroundColor: "background.default",
                        borderRadius: 2,
                        px: 1,
                      }}
                    >
                      <Tab label="On" value={"true"} />
                      <Tab label="Off" value={"false"} />
                    </Tabs>
                  </Box>
                }
                secondary={
                  <Box
                    sx={{
                      mt: 2,
                      pl: 1,
                      display: selectedIndex === 1 ? "block" : "none",
                    }}
                    component={"span"}
                  >
                    <Typography
                      component={"span"}
                      variant="body2"
                      sx={{ color: "text.secondary", display: "flex", gap: 1 }}
                    >
                      <Info sx={{ fontSize: 20 }} />
                      Specifies whether to force dispatch all operations to the
                      specified host.
                    </Typography>
                  </Box>
                }
              />
            </ListItemButton>
            <Divider />
          </>
        }
      />
      <ListItemButton
        ref={hostRef}
        selected={selectedIndex === 2}
        onClick={() => setSelectedIndex(2)}
        sx={{
          borderRadius: 2,
          py: 1.5,
          pb: 1.5,
          border: "1px solid",
          borderColor: "transparent",
          backgroundColor: "transparent",
          color: "text.primary",
          my: 0.5,
          "&:hover": {
            backgroundColor: `${theme.palette.primary.main}22`,
          },
          position: "relative",
        }}
      >
        <ListItemText
          primary={
            <Box
              component={"span"}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography component={"span"} variant="body1">
                Hosts
              </Typography>
            </Box>
          }
          secondary={
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mt: 1,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  backgroundColor: "background.default",
                  borderRadius: 2,
                }}
              >
                <Render
                  if={selectedIndex === 2}
                  then={
                    <Render
                      if={generalConfig.scheme === "mongodb+srv"}
                      then={
                        <TransparentTextField
                          value={generalConfig.hosts[0]}
                          onChange={(event) => {
                            setGeneralConfig({
                              ...generalConfig,
                              hosts: [event.target.value],
                            });
                          }}
                          placeholder="Enter Host"
                          variant="outlined"
                          fullWidth
                          sx={{
                            borderRadius: 2,
                            "& .MuiInputBase-root": {
                              backgroundColor: "background.default",
                            },
                          }}
                        />
                      }
                      else={
                        <TransparentTextField
                          value={newHost}
                          onChange={(event) => setNewHost(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              setGeneralConfig({
                                ...generalConfig,
                                hosts: [...generalConfig.hosts, newHost],
                              });
                              setNewHost("");
                            }
                          }}
                          fullWidth
                          sx={{ borderRadius: 2 }}
                          placeholder="Enter New Host"
                          variant="outlined"
                          InputProps={
                            selectedIndex === 2
                              ? {
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <KeyCombo
                                        keyCombo="Enter"
                                        size="smaller"
                                      />
                                    </InputAdornment>
                                  ),
                                }
                              : {}
                          }
                        />
                      }
                    />
                  }
                />
              </Box>
              <Render
                if={generalConfig.scheme === "mongodb"}
                then={
                  <Box
                    component={"span"}
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {generalConfig.hosts.map((host, index) => (
                      <Chip
                        component={"span"}
                        key={index}
                        label={host}
                        color={selectedIndex !== 2 ? "primary" : "secondary"}
                        sx={{ borderRadius: 2 }}
                        onDelete={() => {
                          setGeneralConfig({
                            ...generalConfig,
                            hosts: generalConfig.hosts.filter(
                              (_, i) => i !== index,
                            ),
                          });
                        }}
                      />
                    ))}
                  </Box>
                }
              />
            </Box>
          }
        />
      </ListItemButton>
    </List>
  );
};
