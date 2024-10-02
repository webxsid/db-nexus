import { KeybindingManager } from "@/helpers/keybindings";
import { useDialogManager } from "@/managers";
import { Add, Person, Search, Settings } from "@mui/icons-material";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CommandCentre } from "./Base.CommandCentre";

export interface IHomeCCAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export type THomeCCMode = "new" | "search" | "actions";

export const HomeCommandCentre: FC = () => {
  const [text, setText] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [currentActions, setCurrentActions] = useState<IHomeCCAction[]>([]);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const { openDialog, isDialogOpen } = useDialogManager();

  const theme = useTheme();

  const handleTextChange = (text: string): void => {
    setText(text);
    setCurrentActions(
      actions.filter((action) => new RegExp(text, "i").test(action.label)),
    );
  };

  const actions = useMemo<IHomeCCAction[]>(
    () => [
      {
        icon: <Add />,
        label: "New Connection",
        onClick: () => {
          console.log("New Connection");
          openDialog("selectDbProvider");
        },
      },
      {
        icon: <Search />,
        label: "Search Connections",
        onClick: () => console.log("Search"),
      },
      {
        icon: <Settings />,
        label: "Open Settings",
        onClick: () => console.log("Settings"),
      },
      {
        icon: <Person />,
        label: "Contact Support",
        onClick: () => console.log("Support"),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    setCurrentActions(actions);
  }, [actions]);

  const handleArrowDown = useCallback(() => {
    setSelectedItem((prev) => (prev + 1) % currentActions.length);
  }, [currentActions.length]);

  const handleArrowUp = useCallback(() => {
    setSelectedItem(
      (prev) => (prev - 1 + currentActions.length) % currentActions.length,
    );
  }, [currentActions.length]);

  const handleEnter = useCallback(() => {
    currentActions[selectedItem].onClick();
  }, [currentActions, selectedItem]);

  useEffect(() => {
    setOpen(isDialogOpen("commandCentre"));
  }, [isDialogOpen]);

  useEffect(() => {
    if (open) {
      KeybindingManager.registerKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.registerKeybinding(["ArrowUp"], handleArrowUp);
      KeybindingManager.registerKeybinding(["Enter"], handleEnter);
    } else {
      KeybindingManager.unregisterKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.unregisterKeybinding(["ArrowUp"], handleArrowUp);
      KeybindingManager.unregisterKeybinding(["Enter"], handleEnter);
    }
    return () => {
      KeybindingManager.unregisterKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.unregisterKeybinding(["ArrowUp"], handleArrowUp);
      KeybindingManager.unregisterKeybinding(["Enter"], handleEnter);
    };
  }, [open, handleArrowDown, handleArrowUp, handleEnter]);

  return (
    <CommandCentre
      text={text}
      onTextChange={handleTextChange}
      dialogType="commandCentre"
      keybindings={["Meta+t"]}
      textPlaceholder="Search for an action..."
    >
      <List sx={{ width: "100%", px: 2 }}>
        {currentActions.map((action, index) => (
          <ListItemButton
            key={index}
            onClick={action.onClick}
            sx={{
              borderRadius: 2,
              py: 1.5,
              border: "1px solid",
              borderColor:
                index === selectedItem ? "primary.main" : "transparent",
              backgroundColor:
                index === selectedItem
                  ? `${theme.palette.primary.main}22`
                  : "transparent",
              color: index === selectedItem ? "tex.secondary" : "text.primary",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              },
            }}
          >
            <ListItemIcon>
              <Box
                sx={{
                  backgroundColor: "secondary.light",
                  color: "secondary.contrastText",
                  aspectRatio: 1,
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 1,
                }}
              >
                {action.icon}
              </Box>
            </ListItemIcon>
            <ListItemText primary={action.label} />
          </ListItemButton>
        ))}
      </List>
    </CommandCentre>
  );
};
