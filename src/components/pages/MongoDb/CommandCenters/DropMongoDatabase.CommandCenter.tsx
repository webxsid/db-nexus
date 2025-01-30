import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import {
  EDialogIds,
  mongoSelectedDatabaseAtom,
  selectedConnectionAtom,
} from "@/store";
import { CommandCentre, HotkeyButton } from "@/components/common";
import { Alert, AlertTitle, Box, IconButton, TextField, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useDialogManager } from "@/managers";
import { KeybindingManager } from "@/helpers/keybindings";
import { toast } from "react-toastify";
import { MongoIpcEvents } from "@/ipc-events";

interface IDropMongoDatabaseCommandCenterProps {
  loadDatabaseList: () => Promise<void>;
}

export const DropMongoDatabaseCommandCenter: FC<
  IDropMongoDatabaseCommandCenterProps
> = ({ loadDatabaseList }) => {
  const selectedDatabase = useAtomValue(mongoSelectedDatabaseAtom);
  const connection = useAtomValue(selectedConnectionAtom);

  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const { hasHistory, closeDialog, clearAllDialogs, isDialogOpen } =
    useDialogManager();

  const open = useMemo<boolean>(
    () => isDialogOpen("dropMongoDatabase"),
    [isDialogOpen],
  );

  const handleEnter = useCallback(async function enterHandler() {
    if (input === selectedDatabase) {
      setLoading(true);
      const res = await MongoIpcEvents.dropDatabase(connection?.id!, selectedDatabase);
      setLoading(false);
      if (!res.ok) {
        toast.error("Failed to drop database");
      } else {
        toast.success(`Database "${selectedDatabase}" dropped successfully`);
        await loadDatabaseList();
      }
        clearAllDialogs();
    } else {
      toast.error("Database name does not match");
    }
  }, [clearAllDialogs, input, loadDatabaseList, selectedDatabase,connection?.id]);

  const handleEsc = useCallback(function escHandler() {
    clearAllDialogs();
  }, [clearAllDialogs]);

  useEffect(() => {
      if(open) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } else {
        setInput("");
      }
  }, [open]);

  const showBack = useMemo(() => hasHistory(), [hasHistory]);

  return (
    <CommandCentre
      text={`Are you sure you want to drop the database "${selectedDatabase}"?`}
      textPlaceholder={"Drop Database"}
      onTextChange={() => {}}
      disableText
      dialogType={EDialogIds.DropMongoDatabase}
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

      footer={
      <Box sx={{ display: "flex", gap: 1, alignItems:"center", justifyContent:"flex-end", p:1}}>

        <HotkeyButton
          keyBindings={["Esc"]}
          disabled={loading}
          showhotkey
          size={"small"}
          hotKeySize={"small"}
          variant={"outlined"}
          onClick={handleEsc}
          >
          Cancel
        </HotkeyButton>

        <HotkeyButton
          onClick={handleEnter}
          keyBindings={["Enter"]}
          disabled={loading}
          showhotkey
          size={"small"}
          hotKeySize={"small"}
          variant={"text"}
          color={"error"}
        >
          Drop Database
        </HotkeyButton>
      </Box>
      }
    >
      <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <Alert severity={"error"} sx={{ borderRadius: 2 }}>
          <AlertTitle>
            Dropping a database will permanently delete all data in the database.
          </AlertTitle>
          <Box sx={{ display: "flex", gap: 1, flexDirection:"column", pt:2 }}>
            <Typography variant="body2">
              Type <strong>"{selectedDatabase}"</strong> to confirm.
            </Typography>
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              variant="outlined"
              size={"small"}
              inputRef={inputRef}
            />
          </Box>
        </Alert>
      </Box>
    </CommandCentre>
  );
};
