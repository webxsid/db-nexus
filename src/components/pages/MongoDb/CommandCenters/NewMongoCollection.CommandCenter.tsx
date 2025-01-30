import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAtomValue } from "jotai";
import {
  EDialogIds,
  mongoDatabaseListAtom,
  mongoNewDatabaseAtom,
  selectedConnectionAtom,
} from "@/store";
import { CC, CommandCentre } from "@/components/common";
import { Box, IconButton, ListItemText } from "@mui/material";
import { Add, ArrowBack } from "@mui/icons-material";
import { useDialogManager } from "@/managers";
import { MongoIpcEvents } from "@/ipc-events";
import { KeybindingManager } from "@/helpers/keybindings";
import { toast } from "react-toastify";

interface INewMongoCollectionCommandCenterProps {
  loadDatabaseList: () => Promise<void>;
  loadCollectionList: () => Promise<void>;
}

export const NewMongoCollectionCommandCenter: FC<INewMongoCollectionCommandCenterProps> = ({
  loadDatabaseList,
  loadCollectionList
                                                                                           }) => {
  const newDatabase = useAtomValue(mongoNewDatabaseAtom);
  const { databases } = useAtomValue(mongoDatabaseListAtom);
  const connection = useAtomValue(selectedConnectionAtom);

  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { hasHistory, closeDialog, clearAllDialogs, isDialogOpen } =
    useDialogManager();

  const handleCreateCollection = useCallback(
    async (collectionName: string): Promise<void> => {
      setLoading(true);
      const toastId = toast.loading(
        `Creating collection "${collectionName}" in database "${newDatabase}"`,
      );
      const res = await MongoIpcEvents.createCollection(
        connection!.id!,
        newDatabase!,
        collectionName,
      );
      setLoading(false);
      toast.dismiss(toastId);
      if (!res.ok) {
        toast.error("Failed to create collection");
      } else {
        toast.success(`Collection "${collectionName}" created successfully`);
      }
      clearAllDialogs();
      await loadDatabaseList();
    },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    [connection, newDatabase],
  );

  const ccOptions = useMemo<
    Array<{
      label: string;
      icon: ReactNode;
      onClick: (collectionName: string) => void;
    }>
  >(() => {
    return [
      {
        label: `Create new Collection "${text}"`,
        icon: <Add />,
        onClick: () => handleCreateCollection(text),
      },
    ];
  }, [text, handleCreateCollection]);

  const open = useMemo<boolean>(
    () => isDialogOpen(EDialogIds.CreateMongoCollection),
    [isDialogOpen],
  );

  const handleArrowDown = useCallback(
    function arrowDownHandler() {
      setSelectedIndex((prev) => {
        if (prev === 0) {
          const inputField = document.getElementById(
            `${EDialogIds.CreateMongoCollection}-search`,
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
          `${EDialogIds.CreateMongoCollection}-search`,
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
        const option = ccOptions[selectedIndex - 1];
        option.onClick(text);
      }
    },
    [open, selectedIndex, ccOptions],
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

  const isNew = useMemo<boolean>(() => {
    return !Object.keys(databases).includes(newDatabase!);
  }, [databases, newDatabase]);

  return (
    <CommandCentre
      text={text}
      textPlaceholder={
        isNew ? "Enter new collection name" : "Enter collection name"
      }
      onTextChange={setText}
      dialogType={EDialogIds.CreateMongoCollection}
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
    >
      <CC.ListButton
        onClick={() => handleCreateCollection(text)}
        disabled={loading}
        selected={selectedIndex === 1}
      >
        <CC.ListIcon>
          <Add />
        </CC.ListIcon>
        <ListItemText primary={`Create new Collection "${text}"`} />
      </CC.ListButton>
    </CommandCentre>
  );
};
