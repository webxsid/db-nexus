import { DarkModeAtom } from "@/store";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useAtom } from "jotai";
import { FC, useCallback } from "react";
import { HotkeyButton } from "./Hotkey.Button";

export const ThemeToggleButton: FC = () => {
  const [darkMode, setDarkMode] = useAtom(DarkModeAtom);
  const handleToggle = useCallback(() => {
    setDarkMode(!darkMode);
  }, [setDarkMode, darkMode]);

  return (
    <HotkeyButton
      variant="outlined"
      tooltip="Toggle Theme"
      keyBindings={["Shift+T", "Shift+t"]}
      onClick={handleToggle}
      showhotkey={"true"}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "currentColor",
        overflow: "hidden",
        borderRadius: 2,
        "& .MuiButton-startIcon": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
      startIcon={
        <Box
          sx={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Brightness7
            sx={{
              position: "absolute",
              transition: "transform 0.3s, opacity 0.3s",
              transform: darkMode ? "translateY(-100%)" : "translateY(0)",
              opacity: darkMode ? 0 : 1,
            }}
          />
          <Brightness4
            sx={{
              position: "absolute",
              transition: "transform 0.3s, opacity 0.3s",
              transform: darkMode ? "translateY(0)" : "translateY(100%)",
              opacity: darkMode ? 1 : 0,
            }}
          />
        </Box>
      }
    ></HotkeyButton>
  );
};
