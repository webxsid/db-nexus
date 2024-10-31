import {
  ArrowUpward,
  KeyboardAlt,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
  KeyboardCommandKey,
  KeyboardControlKey,
  KeyboardReturn,
  KeyboardTab,
  SpaceBar,
} from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { FC, ReactNode, useEffect, useState } from "react";

const fontSizeMap = {
  smaller: 10,
  small: 12,
  normal: 14,
  large: 16,
};

const dimensionMap = {
  smaller: 16,
  small: 20,
  normal: 24,
  large: 28,
};

export interface IKeyComboProps {
  keyCombo: string;
  size?: "smaller" | "small" | "normal" | "large";
} // Component definition

export const KeyCombo: FC<IKeyComboProps> = ({ keyCombo, size }): ReactNode => {
  const [fontSize, setFontSize] = useState<number>(12);
  const [keys, setKeys] = useState<string[]>([]);
  const [dimension, setDimension] = useState<number>(24);

  const theme = useTheme();

  useEffect(() => {
    setFontSize(fontSizeMap[size || "normal"]);
    setDimension(dimensionMap[size || "normal"]);
    setKeys(keyCombo.split("+"));
  }, [size, keyCombo]);

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
        <Box
          component={"span"}
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: dimension,
            minHeight: dimension,
            borderRadius: 1,
            border: "1px solid",
            borderColor: `${theme.palette.primary.main}88`,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          {(() => {
            switch (key.toLowerCase()) {
              case "meta":
                const isMac = navigator.platform.toLowerCase().includes("mac");
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
              case "arrowup":
                return <KeyboardArrowUp sx={{ fontSize }} />;
              case "arrowdown":
                return <KeyboardArrowDown sx={{ fontSize }} />;
              case "arrowleft":
                return <KeyboardArrowLeft sx={{ fontSize }} />;
              case "arrowright":
                return <KeyboardArrowRight sx={{ fontSize }} />;
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
