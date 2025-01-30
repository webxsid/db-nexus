import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  EDialogIds,
  mongoDatabaseListAtom, mongoForceNewDatabaseAtom,
  mongoNewDatabaseAtom
} from "@/store";
import { CC, CommandCentre } from "@/components/common";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  ListItemText,
} from "@mui/material";
import { Add, ArrowBack, Storage } from "@mui/icons-material";
import { useDialogManager } from "@/managers";
import { KeybindingManager } from "@/helpers/keybindings";

export const NewMongoDatabaseCommandCenter: FC = () => {
  const setNewDatabase = useSetAtom(mongoNewDatabaseAtom);
  const [forceNewDatabase,setForceNewDatabase] = useAtom(mongoForceNewDatabaseAtom);
  const { databases } = useAtomValue(mongoDatabaseListAtom);

  const [text, setText] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { openDialog, hasHistory, closeDialog, isDialogOpen } =
    useDialogManager();

  const filteredDatabases = useMemo<string[]>(() => {
    const dbNames = Object.keys(databases);
    if (!text.length) return dbNames;
    return dbNames.filter((dbName) => new RegExp(text, "i").test(dbName));
  }, [databases, text]);

  const handleDbSelect = useCallback(
    (dbName: string): void => {
      setNewDatabase(dbName);
      openDialog(EDialogIds.CreateMongoCollection);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setNewDatabase],
  );

  const ccOptions = useMemo<
    Array<{
      label: string;
      icon: ReactNode;
      onClick: (dbNane: string) => void;
    }>
  >(() => {
    if(!forceNewDatabase) {
    const options = filteredDatabases.map((dbName) => ({
      label: dbName,
      icon: <Storage />,
      onClick: () => handleDbSelect(dbName),
    }));
    if (text.length) {
      options.push({
        label: `Create new database "${text}"`,
        icon: <Add />,
        onClick: () => handleDbSelect(text),
      });
    }

    return options;
    } else {
      return [{
        label: `Create new database "${text}"`,
        icon: <Add />,
        onClick: () => handleDbSelect(text),
      }];
    }
  }, [filteredDatabases, text, handleDbSelect, forceNewDatabase]);

  const open = useMemo<boolean>(
    () => isDialogOpen(EDialogIds.CreateMongoDatabase),
    [isDialogOpen],
  );

  const handleArrowDown = useCallback(
    function arrowDownHandler() {
      setSelectedIndex((prev) => {
        if (prev === 0) {
          const inputField = document.getElementById(
            `${EDialogIds.CreateMongoDatabase}-search`,
          );
          if (inputField) {
            inputField.blur();
          }
        }
        if (prev !== ccOptions.length) {
          return prev + 1;
        }

        return prev;
      });

      const selectedListItem = document.querySelector(
        `#${EDialogIds.MongoCommandCentre}-list .SelectedListItem`,
      );

      if (selectedListItem) {
        selectedListItem.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    },
    [ccOptions],
  );

  const handleArrowUp = useCallback(function arrowUpHandler() {
    setSelectedIndex((prev) => {
      if (prev === 1) {
        // focus on the input field
        const inputField = document.getElementById(
          `${EDialogIds.CreateMongoDatabase}-search`,
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
      selectedListItem.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const handleEnter = useCallback(
    function enterHandler() {
      if (open && selectedIndex > 0 && selectedIndex <= ccOptions.length) {
        const option = ccOptions[selectedIndex -1];
        option.onClick(option.label);
      }

      setForceNewDatabase(false);
    },
    [open, selectedIndex, ccOptions, setForceNewDatabase],
  );

  useEffect(() => {
    if (open) {
      KeybindingManager.registerKeybinding(["ArrowUp"], handleArrowUp);
      KeybindingManager.registerKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.registerKeybinding(["Enter"], handleEnter);
    } else {
      KeybindingManager.unregisterKeybinding(["ArrowUp"], handleArrowUp);
      KeybindingManager.unregisterKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.unregisterKeybinding(["Enter"], handleEnter);
    }

    return () => {
      KeybindingManager.unregisterKeybinding(["ArrowUp"], handleArrowUp);
      KeybindingManager.unregisterKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.unregisterKeybinding(["Enter"], handleEnter);
    };
  }, [open, handleEnter, handleArrowUp, handleArrowDown]);

  const showBack = useMemo(() => hasHistory(), [hasHistory]);

  return (
    <CommandCentre
      text={text}
      textPlaceholder={forceNewDatabase ? "Enter new database name" : "Search for a database or create a new one"}
      onTextChange={setText}
      dialogType={EDialogIds.CreateMongoDatabase}
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
      endAdornment={!forceNewDatabase &&
        <InputAdornment position="end">
          <Chip
            sx={{
              borderRadius: 2,
            }}
            label={`${filteredDatabases.length} Databases`}
            variant="outlined"
          />
        </InputAdornment>
      }
    >
      {ccOptions.map((option, index) => (
        <CC.ListButton
          key={option.label}
          onClick={() => option.onClick(option.label)}
          selected={selectedIndex === index+1}
          className={selectedIndex === index+1 ? "SelectedListItem" : ""}
        >
          <CC.ListIcon>
            {option.icon}
          </CC.ListIcon>
          <ListItemText primary={option.label} />
        </CC.ListButton>
      ))}
    </CommandCentre>
  );
};
