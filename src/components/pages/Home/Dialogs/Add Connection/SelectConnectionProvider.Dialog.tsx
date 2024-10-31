import { CommandCentre } from "@/components/common";
import { KeybindingManager } from "@/helpers/keybindings";
import { useDialogManager } from "@/managers";
import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
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

  const theme = useTheme();

  const handleArrowDown = useCallback(
    function arrowDownHandler() {
      setSelectedIndex((prev) => (prev + 1) % providers.length);
    },
    [providers.length],
  );

  const handleArrowUp = useCallback(
    function arrowUpHandler() {
      setSelectedIndex(
        (prev) => (prev - 1 + providers.length) % providers.length,
      );
    },
    [providers.length],
  );

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
        handleSelect(selectedIndex);
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
          <ListItemButton
            selected={selectedIndex === index}
            key={`${provider.code}-${index}`}
            sx={{
              borderRadius: 2,
              py: 1.5,
              border: "1px solid",
              borderColor: "transparent",
              backgroundColor: "transparent",
              color: "text.primary",
              my: 0.5,
              "&:hover": {
                backgroundColor: `${theme.palette.primary.main}22`,
              },
            }}
            onClick={() => handleSelect(index)}
          >
            <ListItemText primary={provider.name} />
          </ListItemButton>
        ))}
      </List>
    </CommandCentre>
  );
};
