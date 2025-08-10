import { KeybindingManager } from "@/helpers/keybindings";
import { useDialogManager } from "@/managers";
import { CreateNewFolder, Folder, Storage, Tab } from "@mui/icons-material";
import { Box, Chip, List, ListItemText } from "@mui/material";
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { CC, CommandCentre, HotkeyButton } from "@/components/common";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  EDialogIds,
  IMongoConnectionTab,
  IMongoDatabaseTab,
  mongoActiveTabsAtom,
  mongoCollectionListAtom,
  mongoDatabaseListAtom,
  mongoSelectedTabAtom,
  openCollectionAtom,
  selectedConnectionAtom,
  TMongoTab
} from "@/store";
import { v4 } from "uuid";
import Render from "@/components/common/Render.tsx";
import Logo from "@/components/common/Logo.tsx";

interface IMongoBaseCCOption {
  icon: ReactNode;
  label: string;
  type: "action" | "collection" | "database" | "tab" | "connection";
}

interface IMongoCCAction extends IMongoBaseCCOption {
  type: "action";
  onClick: () => void;
}

interface IMongoCCCollection extends IMongoBaseCCOption {
  type: "collection";
  database: string;
  collection: string;
}

interface IMongoCCDatabase extends IMongoBaseCCOption {
  type: "database";
  database: string;
}

interface IMongoCCTab extends IMongoBaseCCOption {
  type: "tab";
  tab: TMongoTab;

}

interface IMongoCCConnection extends IMongoBaseCCOption {
  type: "connection";
}

type TMongoCCOption = IMongoCCAction | IMongoCCCollection | IMongoCCDatabase | IMongoCCTab | IMongoCCConnection;

const OptionListItemText: FC<{ option: TMongoCCOption }> = ({ option }) => (
  <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: "100%" }}>
    <ListItemText
      primary={option.label}
      secondary={option.type === "collection" ? option.database : undefined}
      sx={{ flexGrow: 1 }}
    />
    <Chip sx={{ borderRadius: 2 }} label={option.type.charAt(0).toUpperCase() + option.type.slice(1)} size="small" />
  </Box>
);

export const MongoDbCommandCentre: FC = () => {
  const [text, setText] = useState<string>("");
  const [options, setOptions] = useState<TMongoCCOption[]>([]);
  const [currentOptions, setCurrentOptions] = useState<TMongoCCOption[]>([]);
  const [selectedItem, setSelectedItem] = useState<number>(0);

  const [activeTabs, setActiveTabs] = useAtom(mongoActiveTabsAtom);
  const [_selectedTabId, setSelectedTabId] = useAtom(mongoSelectedTabAtom);
  const collections = useAtomValue(mongoCollectionListAtom);
  const { databases } = useAtomValue(mongoDatabaseListAtom);
  const _connection = useAtomValue(selectedConnectionAtom);
  const openCollectionFromState = useSetAtom(openCollectionAtom);

  const { openDialog, isDialogOpen, clearAllDialogs } = useDialogManager();

  const open = isDialogOpen("mongoCommandCentre");

  const openCollection = useCallback((collection: IMongoCCCollection) => {
    openCollectionFromState(
      collection.collection,
      collection.database,
      "default"
    )
    clearAllDialogs();
  }, [openCollectionFromState, clearAllDialogs]);

  const openDatabase = useCallback((database: IMongoCCDatabase) => {
    const newTabData: IMongoDatabaseTab = {
      type: "database",
      id: v4(),
      database: database.database,
    };
    setActiveTabs((prevTabs) => [...prevTabs, newTabData]);
    setSelectedTabId(newTabData.id);
    clearAllDialogs();
  }, [setActiveTabs, setSelectedTabId, clearAllDialogs]);

  const openConnection = useCallback(() => {
    const newTab: IMongoConnectionTab = {
      type: "connection",
      id: v4()
    }

    setActiveTabs((prevTabs) => [...prevTabs, newTab]);
    setSelectedTabId(newTab.id);
    clearAllDialogs();
  }, [setActiveTabs, setSelectedTabId, clearAllDialogs]);

  const openTab = useCallback((tab: TMongoTab) => {
    console.log("Selected tab", tab.id, "[MongoDb.CommandCentre.tsx, 103]");
    setSelectedTabId(tab.id);
    clearAllDialogs();
  }, [setSelectedTabId, clearAllDialogs]);

  // Update options when dependencies change
  useEffect(() => {
    const defaultOptions: TMongoCCOption[] = [
      {
        icon: <Logo showText={false} width={24} height={24} />,
        label: _connection?.name ?? "Connection",
        type: "connection",
      },
      { icon: <CreateNewFolder />, label: "Create New Collection / Database", type: "action", onClick: () => openDialog(EDialogIds.CreateMongoDatabase) },
    ];

    const tabOptions: TMongoCCOption[] = activeTabs.map((tab) => ({
      icon: <Tab />,
      label: tab.type === "collection" ? tab.collection : (tab as IMongoDatabaseTab).database || "Database",
      type: "tab",
      tab,
    }));

    const databaseOptions: TMongoCCOption[] = Object.keys(databases || {}).map((database) => ({
      icon: <Storage />,
      label: database,
      type: "database",
      database,
    }));

    const collectionOptions: TMongoCCOption[] = collections.map((collection) => ({
      icon: <Folder />,
      label: collection.name,
      type: "collection",
      database: collection.database,
      collection: collection.name,
    }));

    setOptions([...tabOptions, ...databaseOptions, ...collectionOptions, ...defaultOptions]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabs, collections, databases]);

  useEffect(() => {
    if (text.length > 0) {
      setCurrentOptions(options.filter((option) => new RegExp(text, "i").test(option.label)));
    } else {
      setCurrentOptions(options);
    }
  }, [text, options]);

  const handleArrowDown = useCallback(
    function arrowDownHandler() {
      setSelectedItem((prev) => {
        if (prev === 0) {
          const inputField = document.getElementById(
            `${EDialogIds.MongoCommandCentre}-search`,
          );
          if (inputField) {
            inputField.blur();
          }
        }
        if (prev !== currentOptions.length) {
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
    [currentOptions],
  );

  const handleArrowUp = useCallback(function arrowUpHandler() {
    setSelectedItem((prev) => {
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

  const onClick = useCallback((index: number) => {
    const selected = currentOptions[index];
    if (!selected) clearAllDialogs();
    if (selected.type === "collection") openCollection(selected as IMongoCCCollection);
    else if (selected.type === "database") openDatabase(selected as IMongoCCDatabase);
    else if (selected.type === "tab") openTab((selected as IMongoCCTab).tab);
    else if (selected.type === "connection") openConnection();
    else (selected as IMongoCCAction).onClick();
  }, [currentOptions, openCollection, openDatabase, openTab, clearAllDialogs, openConnection]);

  const handleEnter = useCallback(() => {
    onClick(selectedItem - 1);
  }, [onClick, selectedItem]);

  useEffect(() => {
    if (open) {
      KeybindingManager.registerKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.registerKeybinding(["ArrowUp"], handleArrowUp);
      KeybindingManager.registerKeybinding(["Enter"], handleEnter);
    }
    return () => {
      KeybindingManager.unregisterKeybinding(["ArrowDown"], handleArrowDown);
      KeybindingManager.unregisterKeybinding(["ArrowUp"], handleArrowUp);
      KeybindingManager.unregisterKeybinding(["Enter"], handleEnter);
    };
  }, [open, handleArrowDown, handleArrowUp, handleEnter]);

  const footerActions = useMemo(() => {
    const selectedOption = currentOptions[selectedItem - 1];
    if (!selectedOption) return [];

    const actions: Array<{
      label: string,
      keyCombo: string,
    }> = []

    switch (selectedOption.type) {
      case "collection":
        actions.push({ label: "Open Collection", keyCombo: "Enter" });
        break;
      case "database":
        actions.push({ label: "Open Database", keyCombo: "Enter" });
        break;
      case "tab":
        actions.push({ label: "Move to Tab", keyCombo: "Enter" });
        break;
      case "action":
        actions.push({ label: "Execute", keyCombo: "Enter" });
        break;
      case "connection":
        actions.push({ label: "Open Connection", keyCombo: "Enter" });
        break;
    }

    return actions;
  }, [currentOptions, selectedItem]);

  return (
    <CommandCentre
      text={text}
      textPlaceholder="Search for a database, collection, or action..."
      onTextChange={setText}
      dialogType="mongoCommandCentre"
      keybindings={["Meta+t"]}
      footer={footerActions?.length > 0 ? (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "flex-end", px: 1 }}>
          {footerActions.map((action, index) => (
            <HotkeyButton variant={"text"} onClick={handleEnter} key={index} keyBindings={[action.keyCombo]} skipBind showhotkey >{action.label}</HotkeyButton>
          ))}
        </Box>
      ) : null}
    >
      <List dense sx={{ width: "100%" }} >
        <Render if={currentOptions.length > 0} then={currentOptions.map((option, index) => (
          <CC.ListButton
            key={index}
            selected={selectedItem === index + 1}
            onMouseEnter={() => setSelectedItem(index + 1)}
            onClick={() => onClick(index)} className={
              selectedItem === index + 1 ? "SelectedListItem" : ""
            }>
            <CC.ListIcon>{option.icon}</CC.ListIcon>
            <OptionListItemText option={option} />
          </CC.ListButton>
        ))} else={<CC.ListButton><ListItemText primary="No results found" /></CC.ListButton>} />
      </List>
    </CommandCentre>
  );
};
