import { CC } from "@/components/common";
import { KeybindingManager } from "@/helpers/keybindings";
import { useDialogManager } from "@/managers";
import { EDialogIds } from "@/store";
import { Add, Person, Search, Settings } from "@mui/icons-material";
import { List, ListItemText } from "@mui/material";
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

export const HomeCommandCentre: FC = () => {
  const [text, setText] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [currentActions, setCurrentActions] = useState<IHomeCCAction[]>([]);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const { openDialog, isDialogOpen } = useDialogManager();

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

  const handleArrowDown = useCallback(
    function arrowDownHandler() {
      setSelectedItem((prev) => {
        if (prev === 0) {
          const inputField = document.getElementById(
            `${EDialogIds.CommandCentre}-search`,
          );
          console.log(inputField);
          if (inputField) {
            inputField.blur();
          }
        }
        if (prev !== currentActions.length) {
          return prev + 1;
        }
        return prev;
      });
      const selectedListItem = document.querySelector(
        `#${EDialogIds.CommandCentre}-list .SelectedListItem`,
      );

      if (selectedListItem) {
        selectedListItem.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    },
    [currentActions],
  );

  const handleArrowUp = useCallback(function arrowUpHandler() {
    setSelectedItem((prev) => {
      if (prev === 1) {
        // focus on the input field
        const inputField = document.getElementById(
          `${EDialogIds.CommandCentre}-search`,
        );
        if (inputField) {
          inputField.focus();
        }
      }
      if (prev !== 0) {
        return prev - 1;
      }
      return prev;
    });

    const selectedListItem = document.querySelector(
      `#${EDialogIds.CommandCentre}-list .SelectedListItem`,
    );

    if (selectedListItem) {
      selectedListItem.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, []);

  const handleEnter = useCallback(() => {
    currentActions[selectedItem - 1].onClick();
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
          <CC.ListButton
            selected={selectedItem === index + 1}
            key={index}
            onClick={action.onClick}
            className={selectedItem === index + 1 ? "SelectedListItem" : ""}
          >
            <CC.ListIcon>{action.icon}</CC.ListIcon>
            <ListItemText primary={action.label} />
          </CC.ListButton>
        ))}
      </List>
    </CommandCentre>
  );
};
