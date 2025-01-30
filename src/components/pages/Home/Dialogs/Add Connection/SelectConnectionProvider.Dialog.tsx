import { CC, CommandCentre } from "@/components/common";
import { KeybindingManager } from "@/helpers/keybindings";
import { useDialogManager } from "@/managers";
import { EDialogIds } from "@/store";
import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  List,
  ListItemText,
} from "@mui/material";
import { ESupportedDatabases } from "@shared";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";

const availableProviders = [
  {
    name: "Mongo DB",
    code: ESupportedDatabases.Mongo,
  },
  {
    name: "Firestore",
    code: ESupportedDatabases.Firestore,
  },
];

export const SelectConnectionProviderDialog: FC = (): ReactNode => {
  const { isDialogOpen, closeDialog, hasHistory, openDialog } =
    useDialogManager();
  const [open, setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [providers, setProviders] = useState(availableProviders);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showBack, setShowBack] = useState<boolean>(false);

  const handleTextChange = (text: string): void => {
    setText(text);
    const filteredProviders = availableProviders.filter((provider) =>
      // regex to match the text in a case-insensitive way
      new RegExp(text, "i").test(provider.name),
    );
    setProviders(filteredProviders);
  };

  const handleArrowDown = useCallback(
    function arrowDownHandler() {
      setSelectedIndex((prev) => {
        if (prev === 0) {
          const inputField = document.getElementById(
            `${EDialogIds.MongoCommandCentre}-search`,
          );
          if (inputField) {
            inputField.blur();
          }
        }
        if (prev !== providers.length) {
          return prev + 1;
        }
        return prev;
      });
      const selectedListItem = document.querySelector(
        `#${EDialogIds.MongoCommandCentre}-list .SelectedListItem`,
      );

      if (selectedListItem) {
        selectedListItem.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    },
    [providers],
  );

  const handleArrowUp = useCallback(function arrowUpHandler() {
    setSelectedIndex((prev) => {
      if (prev === 1) {
        // focus on the input field
        const inputField = document.getElementById(
          `${EDialogIds.MongoCommandCentre}-search`,
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
      `#${EDialogIds.MongoCommandCentre}-list .SelectedListItem`,
    );

    if (selectedListItem) {
      selectedListItem.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      const selectedProvider = providers[index].code;
      switch (selectedProvider) {
        case ESupportedDatabases.Mongo:
          openDialog("addMongoConnection");
          break;
        case ESupportedDatabases.Firestore:
          console.log("Firestore");
          break;
        default:
          break;
      }
    },
    [providers, openDialog],
  );

  const handleEnter = useCallback(
    function enterHandler() {
      if (open && selectedIndex >= 0 && selectedIndex < providers.length) {
        handleSelect(selectedIndex - 1);
      }
    },
    [open, selectedIndex, providers, handleSelect],
  );

  useEffect(() => {
    console.log("Is Dialog Open", isDialogOpen("selectDbProvider"));
    setOpen(isDialogOpen("selectDbProvider"));
  }, [isDialogOpen]);

  useEffect(() => {
    setShowBack(hasHistory());
  }, [hasHistory]);

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
      keybindings={["Meta+n"]}
      dialogType="selectDbProvider"
      textPlaceholder="Search for Connection Provider"
      text={text}
      onTextChange={handleTextChange}
      startAdornment={
        showBack && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() => closeDialog()}
              size="small"
              sx={{ mr: 1 }}
            >
              <ArrowBack />
            </IconButton>
          </Box>
        )
      }
      endAdornment={
        <InputAdornment position="end">
          <Chip
            sx={{
              borderRadius: 2,
            }}
            label={`${providers.length} Providers`}
            variant="outlined"
          />
        </InputAdornment>
      }
    >
      <List sx={{ width: "100%", px: 2 }}>
        {providers.map((provider, index) => (
          <CC.ListButton
            key={provider.code}
            selected={selectedIndex === index + 1}
            onClick={() => handleSelect(index)}
            className={selectedIndex === index + 1 ? "SelectedListItem" : ""}
          >
            <ListItemText primary={provider.name} />
          </CC.ListButton>
        ))}
      </List>
    </CommandCentre>
  );
};
