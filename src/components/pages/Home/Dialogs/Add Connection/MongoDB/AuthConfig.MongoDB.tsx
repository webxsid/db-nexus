import { TransparentTextField } from "@/components/common";
import Render from "@/components/common/Render";
import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  Typography,
  useTheme
} from "@mui/material";
import {
  IMongoConnectionParams,
  TMongoAuthMethods,
  TMongoPasswordAuthMechanism,
} from "@shared";
import { SetStateAction } from "jotai";
import React, {
  Dispatch,
  FC,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

interface IProps {
  isActive: boolean;
  authConfig: IMongoConnectionParams["auth"];
  setAuthConfig: Dispatch<SetStateAction<IMongoConnectionParams["auth"]>>;
}

const availableAuthMethods: TMongoAuthMethods[] = ["none", "password"];
const availableAuthMechanisms: TMongoPasswordAuthMechanism[] = [
  "DEFAULT",
  "SCRAM-SHA-1",
  "SCRAM-SHA-256",
];

export const AuthConfig: FC<IProps> = ({
  isActive,
  authConfig,
  setAuthConfig,
}): ReactNode => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [maxIndex, _setMaxIndex] = React.useState<number>(0);
  const [passwordFieldType, setPasswordFieldType] = React.useState<
    "text" | "password"
  >("password");
  const theme = useTheme();

  const authMethodRef = React.useRef<HTMLDivElement>(null);
  const usernameRef = React.useRef<HTMLDivElement>(null);
  const passwordRef = React.useRef<HTMLDivElement>(null);
  const authDbRef = React.useRef<HTMLDivElement>(null);
  const authMechanismRef = React.useRef<HTMLDivElement>(null);

  const focusAuthMethodRef = useCallback(function authMethodFocus(): void {
    authMethodRef.current?.focus();
  }, []);

  const focusUsernameRef = useCallback(function usernameFocus(): void {
    const input = usernameRef.current?.querySelector("input");
    input?.focus();
  }, []);

  const focusPasswordRef = useCallback(function passwordFocus(): void {
    const input = passwordRef.current?.querySelector("input");
    input?.focus();
  }, []);

  const focusAuthDbRef = useCallback(function authDbFocus(): void {
    const input = authDbRef.current?.querySelector("input");
    input?.focus();
  }, []);

  const focusAuthMechanismRef = useCallback(
    function authMechanismFocus(): void {
      authMechanismRef.current?.focus();
    },
    [],
  );

  const togglePasswordFieldType = (): void => {
    if (passwordFieldType === "text") {
      setPasswordFieldType("password");
    } else {
      setPasswordFieldType("text");
    }
  };

  const selectAuthMethod = (newMethod: TMongoAuthMethods): void => {
    setAuthConfig((prev) => ({
      ...prev,
      method: newMethod,
    }));
  };

  const toggleAuthMethod = useCallback(() => {
    setAuthConfig((prev) => {
      const currentIndex = availableAuthMethods.indexOf(prev.method);
      const nextIndex = currentIndex + 1;
      const nextMethod =
        nextIndex < availableAuthMethods.length
          ? availableAuthMethods[nextIndex]
          : availableAuthMethods[0];
      return {
        ...prev,
        method: nextMethod,
      };
    });
  }, [setAuthConfig]);

  const toggleAuthMechanism = useCallback(() => {
    setAuthConfig((prev) => {
      const currentIndex = prev.passwordParams?.authMechanism ? availableAuthMechanisms.indexOf(
        prev.passwordParams?.authMechanism,
      ): 0;
      const nextIndex = currentIndex + 1;
      const nextMechanism =
        nextIndex < availableAuthMechanisms.length
          ? availableAuthMechanisms[nextIndex]
          : availableAuthMechanisms[0];
      return {
        ...prev,
        passwordParams: {
          ...prev.passwordParams,
          authMechanism: nextMechanism,
        },
      };
    });
  }, [setAuthConfig]);

  const handleAuthMethodSpace = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        toggleAuthMethod();
      }
    },
    [toggleAuthMethod],
  );

  const handleAuthMechanismSpace = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        toggleAuthMechanism();
      }
    },
    [toggleAuthMechanism],
  );

  const handleNext = useCallback(() => {
    if (selectedIndex < maxIndex) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, maxIndex]);

  const handlePrev = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleArrowDown = useCallback(
    function tabHandler(event: KeyboardEvent): void {
      event.preventDefault();
      handleNext();
    },
    [handleNext],
  );

  const handleArrowUp = useCallback(
    function shiftTabHandler(event: KeyboardEvent): void {
      event.preventDefault();
      handlePrev();
    },
    [handlePrev],
  );

  useEffect(() => {
    if (isActive) {
      KeybindingManager.registerKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.registerKeybinding(["ArrowUp"], handleArrowUp);
    } else {
      KeybindingManager.unregisterKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.unregisterKeybinding(["ArrowUp"], handleArrowUp);
    }
  }, [isActive, handleArrowDown, handleArrowUp]);

  useEffect(() => {
    const currentRef =
      selectedIndex === 0
        ? authMethodRef
        : selectedIndex === 1
          ? usernameRef
          : selectedIndex === 2
            ? passwordRef
            : selectedIndex === 3
              ? authDbRef
              : authMechanismRef;
    const focusHandler =
      selectedIndex === 0
        ? focusAuthMethodRef
        : selectedIndex === 1
          ? focusUsernameRef
          : selectedIndex === 2
            ? focusPasswordRef
            : selectedIndex === 3
              ? focusAuthDbRef
              : focusAuthMechanismRef;

    if (focusHandler) {
      focusHandler();
    }

    const spaceHandler =
      selectedIndex === 0
        ? handleAuthMethodSpace
        : selectedIndex === 4
          ? handleAuthMechanismSpace
          : undefined;

    if (spaceHandler) {
      currentRef.current?.addEventListener("keydown", spaceHandler);
    }

    return () => {
      if(spaceHandler)
      currentRef.current?.removeEventListener("keydown", spaceHandler);
    };
  }, [
    selectedIndex,
    authMethodRef,
    handleAuthMethodSpace,
    handleAuthMechanismSpace,
    focusAuthMethodRef,
    focusAuthDbRef,
    focusAuthMechanismRef,
    focusPasswordRef,
    focusUsernameRef,
  ]);

  useEffect(() => {
    if (isActive) {
      setSelectedIndex(0);
    }
  }, [isActive]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isActive) {
        focusAuthMethodRef();
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isActive, focusAuthMethodRef]);

  useEffect(() => {
    if (authConfig.method === "password") {
      _setMaxIndex(4);
    }
  }, [authConfig.method]);

  return (
    <List sx={{ width: "100%" }}>
      <ListItemButton
        ref={authMethodRef}
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
                Authentication Method
              </Typography>
              <Tabs
                value={authConfig.method}
                onChange={(event, newValue) => selectAuthMethod(newValue)}
                sx={{
                  backgroundColor: "background.default",
                  borderRadius: 2,
                  px: 1,
                }}
              >
                {availableAuthMethods.map((method) => (
                  <Tab key={method} value={method} label={method} />
                ))}
              </Tabs>
            </Box>
          }
        />
      </ListItemButton>
      <Render
        if={authConfig.method === "password"}
        then={
          <>
            <ListItemButton
              onClick={() => setSelectedIndex(1)}
              ref={usernameRef}
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
                      Username
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box
                    sx={{
                      width: "100%",
                      backgroundColor: "background.default",
                      borderRadius: 2,
                      mt: 1,
                    }}
                  >
                    <TransparentTextField
                      placeholder="Username"
                      value={authConfig?.passwordParams?.username || ""}
                      onChange={(event) =>
                        setAuthConfig((prev) => ({
                          ...prev,
                          passwordParams: {
                            ...prev.passwordParams,
                            username: event.target.value,
                          },
                        }))
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="body2" color={"primary.main"}>
                              optional
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                    />
                  </Box>
                }
              />
            </ListItemButton>
            <ListItemButton
              onClick={() => setSelectedIndex(2)}
              ref={passwordRef}
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
                      Password
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box
                    sx={{
                      width: "100%",
                      backgroundColor: "background.default",
                      borderRadius: 2,
                      mt: 1,
                    }}
                  >
                    <TransparentTextField
                      placeholder="Password"
                      type={passwordFieldType}
                      onKeyDown={(event) => {
                        if (event.altKey && event.code === "KeyV") {
                          togglePasswordFieldType();
                        }
                      }}
                      value={authConfig.passwordParams?.password}
                      onChange={(event) =>
                        setAuthConfig((prev) => ({
                          ...prev,
                          passwordParams: {
                            ...prev.passwordParams,
                            password: event.target.value,
                          },
                        }))
                      }
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="body2" color={"primary.main"}>
                              optional
                            </Typography>
                            <IconButton onClick={togglePasswordFieldType}>
                              {passwordFieldType === "text" ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                }
              />
            </ListItemButton>
            <ListItemButton
              onClick={() => setSelectedIndex(3)}
              ref={authDbRef}
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
                      Auth Source
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box
                    sx={{
                      width: "100%",
                      backgroundColor: "background.default",
                      borderRadius: 2,
                      mt: 1,
                    }}
                  >
                    <TransparentTextField
                      placeholder="Auth Source"
                      value={authConfig.passwordParams?.authDb}
                      onChange={(event) =>
                        setAuthConfig((prev) => ({
                          ...prev,
                          passwordParams: {
                            ...prev.passwordParams,
                            authDb: event.target.value,
                          },
                        }))
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="body2" color={"primary.main"}>
                              optional
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                    />
                  </Box>
                }
              />
            </ListItemButton>
            <ListItemButton
              onClick={() => setSelectedIndex(4)}
              ref={authMechanismRef}
              sx={{
                borderRadius: 2,
                py: 1.5,
                pb: selectedIndex === 4 ? 4 : 1.5,
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
                  display: selectedIndex === 4 ? "flex" : "none",
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
                <KeyCombo keyCombo="Space" size="smaller" /> to toggle
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
                      Auth Mechanism
                    </Typography>
                    <Tabs
                      value={authConfig?.passwordParams?.authMechanism || "DEFAULT"}
                      sx={{
                        backgroundColor: "background.default",
                        borderRadius: 2,
                        px: 1,
                      }}
                    >
                      {availableAuthMechanisms.map((mechanism) => (
                        <Tab
                          key={mechanism}
                          value={mechanism}
                          label={mechanism}
                        />
                      ))}
                    </Tabs>
                  </Box>
                }
              />
            </ListItemButton>
          </>
        }
      />
    </List>
  );
};
