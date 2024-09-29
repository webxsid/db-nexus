import {
  ArrowUpward,
  KeyboardAlt,
  KeyboardCommandKey,
  KeyboardControlKey,
  KeyboardReturn,
  KeyboardTab,
  SpaceBar,
} from "@mui/icons-material";
import { Box, Theme, Typography, useTheme } from "@mui/material";
import { ReactNode, useCallback, useEffect, useMemo } from "react";

type TKeyBindingCallback = (event: KeyboardEvent) => void;

interface IKeyBinding {
  keyCombo: string;
  callback: TKeyBindingCallback;
}

const forcedKeyCombos: string[] = [
  "ArrowUp",
  "ArrowDown",
  "Enter",
  "Meta+Shift+c",
  "Meta+1",
  "Meta+2",
  "Meta+3",
  "Meta+4",
  "Meta+5",
  "Meta+6",
  "Meta+7",
  "Meta+8",
  "Meta+9",
  "Meta+0",
];

export interface IKeybindingManager {
  registerKeybinding: (
    keyCombos: string | string[],
    callback: TKeyBindingCallback,
  ) => void;
  unregisterKeybinding: (
    keyCombos: string | string[],
    callback: TKeyBindingCallback,
  ) => void;
  getKeyComboIcons: (
    keyCombo: string,
    theme: Theme,
    size?: "smaller" | "small" | "normal" | "large",
  ) => ReactNode;
}
// Hook to manage keybindings
export const useKeybindingManager = (): IKeybindingManager => {
  const bindings = useMemo<{ [keyCombo: string]: IKeyBinding[] }>(
    () => ({}),
    [],
  );

  const theme = useTheme();

  const registerKeybinding = (
    keyCombos: string | string[],
    callback: TKeyBindingCallback,
  ): void => {
    const combos = Array.isArray(keyCombos) ? keyCombos : [keyCombos];

    combos.forEach((combo) => {
      if (!bindings[combo]) {
        bindings[combo] = [];
      }
      bindings[combo].push({ keyCombo: combo, callback });
    });
  };

  const unregisterKeybinding = (
    keyCombos: string | string[],
    callback: TKeyBindingCallback,
  ): void => {
    const combos = Array.isArray(keyCombos) ? keyCombos : [keyCombos];

    combos.forEach((combo) => {
      if (bindings[combo]) {
        bindings[combo] = bindings[combo].filter(
          (binding) => binding.callback !== callback,
        );
        if (bindings[combo].length === 0) {
          delete bindings[combo];
        }
      }
    });
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      const activeElement = document.activeElement as HTMLElement;
      const isTypingContext =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.isContentEditable;

      const keyCombo = getKeyCombo(event);

      if (isTypingContext && !forcedKeyCombos.includes(keyCombo)) {
        return;
      }

      if (bindings[keyCombo]) {
        bindings[keyCombo].forEach((binding) => binding.callback(event));
      }
    },
    [bindings],
  );

  const getKeyCombo = (event: KeyboardEvent): string => {
    const keys = [];

    if (event.metaKey || event.ctrlKey) {
      keys.push("Meta");
    }
    if (event.altKey) {
      keys.push("Alt");
    }
    if (event.shiftKey) {
      keys.push("Shift");
    }
    if (event.key === " ") {
      keys.push("Space");
    } else {
      keys.push(event.key);
    }
    return keys.join("+");
  };

  // Helper function to get key combo icons
  const getKeyComboIcons = (
    keyCombo: string,
    size: "smaller" | "small" | "normal" | "large" = "normal",
  ): ReactNode => {
    const keys = keyCombo.split("+");
    const fontSize =
      size === "smaller"
        ? 9
        : size === "small"
          ? 12
          : size === "normal"
            ? 16
            : 20;
    const width =
      size === "smaller"
        ? 16
        : size === "small"
          ? 24
          : size === "normal"
            ? 32
            : 40;
    const height =
      size === "smaller"
        ? 16
        : size === "small"
          ? 24
          : size === "normal"
            ? 32
            : 40;
    const boxStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: width,
      minHeight: height,
      borderRadius: 1,
      border: "1px solid",
      borderColor: `${theme.palette.primary.main}88`,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    };

    return (
      <Box
        component={"span"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
        }}
      >
        {keys.map((key, index) => (
          <Box component={"span"} key={index} sx={boxStyle}>
            {(() => {
              switch (key.toLowerCase()) {
                case "meta":
                  const isMac = navigator.platform
                    .toLowerCase()
                    .includes("mac");
                  return isMac ? (
                    <KeyboardCommandKey sx={{ fontSize }} />
                  ) : (
                    <KeyboardControlKey sx={{ fontSize }} />
                  );
                case "shift":
                  return <ArrowUpward sx={{ fontSize }} />;
                case "alt":
                  return <KeyboardAlt sx={{ fontSize }} />;
                case "ctrl":
                  return <KeyboardControlKey sx={{ fontSize }} />;
                case "enter":
                  return <KeyboardReturn sx={{ fontSize }} />;
                case "tab":
                  return <KeyboardTab sx={{ fontSize }} />;
                case "space":
                  return <SpaceBar sx={{ fontSize }} />;
                default:
                  return (
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{
                        fontSize,
                        color: "inherit",
                        fontFamily: "monospace",
                      }}
                    >
                      {key.toUpperCase()}
                    </Typography>
                  );
              }
            })()}
          </Box>
        ))}
      </Box>
    );
  };

  // Use useEffect to attach keydown event listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [bindings, handleKeyDown]);

  // Return the register and unregister functions
  return { registerKeybinding, unregisterKeybinding, getKeyComboIcons };
};
