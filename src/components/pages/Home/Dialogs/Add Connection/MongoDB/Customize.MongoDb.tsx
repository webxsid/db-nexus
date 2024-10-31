import { TransparentTextField } from "@/components/common";
import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";
import { Cancel } from "@mui/icons-material";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { SetStateAction } from "jotai";
import {
  Dispatch,
  FC,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface ICustomizeMongoConnectionProps {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
}
export const CustomizeMongoConnection: FC<ICustomizeMongoConnectionProps> = ({
  name,
  setName,
  color,
  setColor,
  isOpen,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const theme = useTheme();
  const nameRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  const focusNameRef = useCallback(function focusNameRef() {
    const input = nameRef.current?.querySelector("input");
    input?.focus();
  }, []);

  const focusColorRef = useCallback(function focusColorRef() {
    colorRef.current?.focus();
  }, []);

  const availableColors = useMemo(() => {
    return [
      "", // no color
      "#FFB3BA", // pastel pink
      "#FFDFBA", // pastel orange
      "#FFFFBA", // pastel yellow
      "#BAFFC9", // pastel green
      "#BAE1FF", // pastel blue
      "#D32F2F", // random red
      "#1976D2", // random blue
      "#388E3C", // random green
    ];
  }, []);

  const colorSpaceHandler = useCallback(
    function colorSpaceHandler(event: SyntheticEvent): void {
      console.log("colorSpaceHandler");
      // cycle through colors
      const currentIndex = availableColors.indexOf(color);
      const nextIndex = (currentIndex + 1) % availableColors.length;
      setColor(availableColors[nextIndex]);
    },
    [availableColors, color, setColor],
  );

  const handleNext = useCallback(() => {
    if (selectedIndex < 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex]);

  const handlePrev = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleArrowDown = useCallback(
    function tabHandler(event: SyntheticEvent): void {
      event.preventDefault();
      handleNext();
    },
    [handleNext],
  );

  const handleArrowUp = useCallback(
    function shiftTabHandler(event: SyntheticEvent): void {
      event.preventDefault();
      handlePrev();
    },
    [handlePrev],
  );

  useEffect(() => {
    if (isOpen) {
      focusNameRef();
      setSelectedIndex(0);
    }
  }, [focusNameRef, isOpen]);

  useEffect(() => {
    if (!color) {
      setColor(availableColors[0]);
    }
  }, [availableColors, color, setColor]);

  useEffect(() => {
    if (isOpen) {
      KeybindingManager.registerKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.registerKeybinding(["ArrowUp"], handleArrowUp);
    } else {
      KeybindingManager.unregisterKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.unregisterKeybinding(["ArrowUp"], handleArrowUp);
    }

    return () => {
      KeybindingManager.unregisterKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.unregisterKeybinding(["ArrowUp"], handleArrowUp);
    };
  }, [handleArrowDown, handleArrowUp, isOpen]);

  useEffect(() => {
    if (selectedIndex === 0) {
      focusNameRef();
    } else {
      focusColorRef();
    }
  }, [selectedIndex, focusNameRef, focusColorRef]);

  useEffect(() => {
    if (selectedIndex === 1) {
      KeybindingManager.registerKeybinding(["Space"], colorSpaceHandler);
    } else {
      KeybindingManager.unregisterKeybinding(["Space"], colorSpaceHandler);
    }

    return () => {
      KeybindingManager.unregisterKeybinding(["Space"], colorSpaceHandler);
    };
  }, [colorSpaceHandler, selectedIndex]);
  return (
    <List sx={{ width: "100%", px: 1 }}>
      <ListItemButton
        ref={nameRef}
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
        <ListItemText
          primary={
            <Typography component={"span"} variant="body1">
              Name your connection
            </Typography>
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
                placeholder="Connection Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
              />
            </Box>
          }
        />
      </ListItemButton>
      <ListItemButton
        ref={colorRef}
        selected={selectedIndex === 1}
        onClick={() => setSelectedIndex(1)}
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
            <Typography component={"span"} variant="body1">
              Choose a color
            </Typography>
          }
          secondary={
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 1,
              }}
            >
              {availableColors.map((availableColor) => (
                <Box
                  key={availableColor}
                  sx={{
                    aspectRatio: 1,
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 32,
                    backgroundColor: availableColor,
                    border: availableColor === color ? "2px solid" : "none",
                    borderColor: theme.palette.secondary.contrastText,
                  }}
                >
                  {availableColor === "" && <Cancel />}
                </Box>
              ))}
            </Box>
          }
        />
      </ListItemButton>
    </List>
  );
};
