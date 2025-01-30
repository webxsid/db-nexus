import { TransparentTextField } from "@/components/common";
import Render from "@/components/common/Render";
import { KeybindingManager } from "@/helpers/keybindings";
import { EDialogIds } from "@/store";
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
} from "@mui/material";
import {
  IMongoConnectionParams,
  TMongoAuthMethods,
  TMongoPasswordAuthMechanism,
} from "@shared";
import { SetStateAction } from "jotai";
import {
  Dispatch,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [passwordFieldType, setPasswordFieldType] = useState<
    "text" | "password"
  >("password");

  // Refs initialized at the top level to follow the Rules of Hooks
  const authMethodRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const authDbRef = useRef<HTMLDivElement>(null);
  const authMechanismRef = useRef<HTMLDivElement>(null);

  // Group the refs into an object
  const inputRefs = useMemo(
    () => ({
      authMethod: authMethodRef,
      username: usernameRef,
      password: passwordRef,
      authDb: authDbRef,
      authMechanism: authMechanismRef,
    }),
    [],
  );

  const focusField = useCallback(
    (field: keyof typeof inputRefs) => {
      if (field === "authMethod") {
        inputRefs[field]?.current?.focus();
      } else {
        inputRefs[field]?.current?.querySelector("input")?.focus();
      }
    },
    [inputRefs],
  );

  const togglePasswordFieldType = (): void =>
    setPasswordFieldType((prev) => (prev === "text" ? "password" : "password"));

  const selectAuthMethod = (newMethod: TMongoAuthMethods): void => {
    setAuthConfig((prev) => ({ ...prev, method: newMethod }));
  };

  const cycleOptions = useCallback(
    (options: string[], current: string, updater: (value: string) => void) => {
      const nextIndex = (options.indexOf(current) + 1) % options.length;
      updater(options[nextIndex]);
    },
    [],
  );

  const handleSpaceKey = useCallback(
    function onSpaceKey() {
      if (selectedIndex === 0) {
        cycleOptions(availableAuthMethods, authConfig.method, (val) =>
          setAuthConfig((prev) => ({
            ...prev,
            method: val as TMongoAuthMethods,
          })),
        );
      } else if (selectedIndex === 4) {
        cycleOptions(
          availableAuthMechanisms,
          authConfig.passwordParams?.authMechanism || "DEFAULT",
          (val) =>
            setAuthConfig((prev) => ({
              ...prev,
              passwordParams: {
                ...prev.passwordParams,
                authMechanism: val as TMongoPasswordAuthMechanism,
              },
            })),
        );
      }
    },
    [selectedIndex, authConfig, cycleOptions, setAuthConfig],
  );

  const handleArrowNavigation = useCallback(
    (direction: "up" | "down") => {
      setSelectedIndex((prev) => {
        const nextIndex =
          direction === "down"
            ? Math.min(prev + 1, maxIndex)
            : Math.max(prev - 1, 0);

        if (prev === 0) {
          const input = document.getElementById(
            `${EDialogIds.SelectDbProvider}-search`,
          );
          if (input) {
            input.focus();
          }
        } else {
          const refKeys = Object.keys(inputRefs) as Array<
            keyof typeof inputRefs
          >;
          focusField(refKeys[nextIndex]);
        }
        return nextIndex;
      });
    },
    [maxIndex, focusField, inputRefs],
  );

  const handleArrowUp = useCallback(
    function onArrowUp() {
      handleArrowNavigation("up");
    },
    [handleArrowNavigation],
  );

  const handleArrowDown = useCallback(
    function onArrowDown() {
      handleArrowNavigation("down");
    },
    [handleArrowNavigation],
  );

  useEffect(() => {
    // Key bindings
    KeybindingManager.registerKeybinding("ArrowUp", handleArrowUp);
    KeybindingManager.registerKeybinding("ArrowDown", handleArrowDown);
    KeybindingManager.registerKeybinding("Space", handleSpaceKey);

    return () => {
      KeybindingManager.unregisterKeybinding("ArrowUp", handleArrowUp);
      KeybindingManager.unregisterKeybinding("ArrowDown", handleArrowDown);
      KeybindingManager.unregisterKeybinding("Space", handleSpaceKey);
    };
  }, [handleSpaceKey, handleArrowUp, handleArrowDown]);

  useEffect(() => {
    if (isActive) {
      focusField("authMethod");
      setSelectedIndex(0);
    }
  }, [isActive, focusField]);

  useEffect(() => {
    setMaxIndex(authConfig.method === "password" ? 3 : 0);
  }, [authConfig.method]);

  return (
    <List sx={{ width: "100%" }}>
      {/* Auth Method */}
      <ListItemButton
        ref={inputRefs.authMethod}
        selected={selectedIndex === 0}
        onClick={() => setSelectedIndex(0)}
        sx={{ borderRadius: 2, py: 1.5, my: 0.5 }}
      >
        <ListItemText
          primary={
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1">Authentication Method</Typography>
              <Tabs
                value={authConfig.method}
                ref={authMethodRef}
                onChange={(_, newValue) => selectAuthMethod(newValue)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: "background.default",
                  px: 1,
                  "& .MuiTab-root.Mui-selected": {
                    color: "primary.main",
                  },
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

      {/* Password Auth Fields */}
      <Render
        if={authConfig.method === "password"}
        then={
          <>
            {/* Username */}
            <ListItemButton
              ref={inputRefs.username}
              selected={selectedIndex === 1}
              onClick={() => setSelectedIndex(1)}
              sx={{ borderRadius: 2, my: 0.5 }}
            >
              <ListItemText
                primary="Username"
                secondary={
                  <TransparentTextField
                    placeholder="Username"
                    value={authConfig.passwordParams?.username || ""}
                    onChange={(e) =>
                      setAuthConfig((prev) => ({
                        ...prev,
                        passwordParams: {
                          ...prev.passwordParams,
                          username: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                  />
                }
              />
            </ListItemButton>

            {/* Password */}
            <ListItemButton
              ref={inputRefs.password}
              selected={selectedIndex === 2}
              onClick={() => setSelectedIndex(2)}
              sx={{ borderRadius: 2, my: 0.5 }}
            >
              <ListItemText
                primary="Password"
                secondary={
                  <TransparentTextField
                    placeholder="Password"
                    type={passwordFieldType}
                    value={authConfig.passwordParams?.password || ""}
                    onChange={(e) =>
                      setAuthConfig((prev) => ({
                        ...prev,
                        passwordParams: {
                          ...prev.passwordParams,
                          password: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
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
                }
              />
            </ListItemButton>

            {/* Auth DB */}
            <ListItemButton
              ref={inputRefs.authDb}
              selected={selectedIndex === 3}
              onClick={() => setSelectedIndex(3)}
              sx={{ borderRadius: 2, my: 0.5 }}
            >
              <ListItemText
                primary="Auth Database"
                secondary={
                  <TransparentTextField
                    placeholder="Auth Database"
                    value={authConfig.passwordParams?.authDb || ""}
                    onChange={(e) =>
                      setAuthConfig((prev) => ({
                        ...prev,
                        passwordParams: {
                          ...prev.passwordParams,
                          authDb: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                  />
                }
              />
            </ListItemButton>
          </>
        }
      />
    </List>
  );
};
