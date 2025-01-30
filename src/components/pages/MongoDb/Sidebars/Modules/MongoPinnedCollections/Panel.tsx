import { FC, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  IMongoCollectionTab,
  mongoActiveTabsAtom,
  mongoPinnedTabsAtom,
  mongoSelectedTabAtom,
  TMongoCollectionListAtom,
  TMongoTab,
} from "@/store";
import {
  Box,
  IconButton,
  InputAdornment,
  List, ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme
} from "@mui/material";
import { MongoSidebarModulePanelTemplate } from "../Templates";
import { Folder, FolderOpen, MoreVert, PushPin } from "@mui/icons-material";
import Render from "@/components/common/Render.tsx";
import { v4 } from "uuid";
import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";
import { TransparentTextField } from "@/components/common";
import { usePopper } from "@/hooks";

export const MongoPinnedCollectionsPanel: FC = () => {
  const [collections, setPinnedCollection] = useAtom(mongoPinnedTabsAtom);
  const [activeTabs, setActiveTabs] = useAtom(mongoActiveTabsAtom);
  const [selectedTabId, setSelectedTabId] = useAtom(mongoSelectedTabAtom);

  const selectedTab = useMemo<TMongoTab | undefined>(() => {
    return activeTabs.find((tab) => tab.id === selectedTabId);
  }, [selectedTabId, activeTabs]);

  const [collectionSearch, setCollectionSearch] = useState<string>("");
  const filteredCollections = useMemo<TMongoCollectionListAtom>(() => {
    if (!collectionSearch) return collections;
    return collections.filter((c) =>
      new RegExp(collectionSearch, "i").test(c.name),
    );
  }, [collections, collectionSearch]);

  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const {showPopper, hidePopper} = usePopper()

  const clearSearch = useCallback(function onClearSearch() {
    setCollectionSearch("");
  }, []);

  const focusSearch = useCallback(function onFocusSearch() {
    searchRef.current?.focus();
  }, []);

  const openCollection = useCallback(
    (collection: string, database: string) => {
      const existingTab = activeTabs.find(
        (tab) =>
          tab?.type === "collection" &&
          tab?.collection === collection &&
          tab?.database === database,
      );

      if (existingTab) {
        setSelectedTabId(existingTab.id);
        return;
      }
      const newTabData: IMongoCollectionTab = {
        type: "collection",
        id: v4(),
        collection,
        database,
      };
      setActiveTabs((prevTabs) => [...prevTabs, newTabData]);
      setSelectedTabId(newTabData.id);
    },
    [setActiveTabs, setSelectedTabId, activeTabs],
  );

  const unPinCollection = useCallback(
    (e: MouseEvent, collection: string, database: string) => {
      e.stopPropagation();
      e.preventDefault();

      const newPinnedCollections = collections.filter(
        (c) => c.name !== collection && c.database !== database,
      );
      setPinnedCollection(newPinnedCollections);
      setCollectionSearch("");
    },
    [collections, setPinnedCollection],
  );

  const onHover = useCallback((e: MouseEvent, label: string) => {
    showPopper(
      e.currentTarget,
      {
        content: <Typography variant="body2">{label}</Typography>,
      }
    )
  },[showPopper])

  useEffect(() => {
    if (!selectedTab) return;

    if (selectedTab.type !== "collection") return;
    const query = `#collection-${selectedTab.database}-${selectedTab.id}`;

    if (!query) return;

    const element = document.querySelector(query);

    if (element) {
      element.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [selectedTab]);

  useEffect(() => {
    KeybindingManager.registerKeybinding(["Escape"], clearSearch);
    KeybindingManager.registerKeybinding(["Meta+k"], focusSearch);
    return () => {
      KeybindingManager.unregisterKeybinding(["Escape"], clearSearch);
      KeybindingManager.unregisterKeybinding(["Meta+k"], focusSearch);
    };
  }, [clearSearch, focusSearch]);
  return (
    <MongoSidebarModulePanelTemplate
      label={"Pinned Collections"}
      moduleKey={"pinned-collections"}
      side={"left"}
      headerActions={[]}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
        }}
      >
        <TransparentTextField
          placeholder={"Search collections.."}
          variant="outlined"
          size={"small"}
          value={collectionSearch}
          onChange={(e) => setCollectionSearch(e.target.value)}
          inputRef={searchRef}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          sx={{
            color: "text.primary",
          }}
          slotProps={{
            input: {
              endAdornment: !isSearchFocused ? (
                <InputAdornment position={"end"}>
                  <KeyCombo keyCombo={"Meta+k"} size={"small"} />
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </Box>
      <Render
        if={filteredCollections.length > 0}
        then={
          <List
            dense
            sx={{
              px: 1,
            }}
          >
            {filteredCollections.map((c) => (
              <ListItem
                key={`${c?.database}-${c?.name}`}
                id={`collection-${c?.database}-${c?.name}`}
                role={"button"}
                dense
                disableGutters
                sx={{
                  p: 0,
                  cursor: "pointer",
                  borderRadius: 2,
                  transition: "background-color 0.2s",
                  backgroundColor: selectedTab?.type === "collection" && selectedTab.collection === c.name && selectedTab.database === c.database ? "action.selected" : "transparent",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                onClick={() => openCollection(c?.name, c?.database)}
                secondaryAction={
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                  <IconButton
                    size={"small"}
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      height: "100%",
                    }}
                    onClick={(e) => unPinCollection(e, c?.name, c?.database)}
                    onMouseEnter={(e) => onHover(e, "Unpin collection")}
                    onMouseLeave={hidePopper}
                  >
                    <PushPin sx={{ fontSize: "0.9rem", transform: "rotate(45deg)" }} />
                  </IconButton>
                  <IconButton
                    size={"small"}
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      height: "100%",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => onHover(e, "More options")}
                    onMouseLeave={hidePopper}
                  >
                    <MoreVert sx={{ fontSize: "0.9rem" }} />
                  </IconButton>
                </Box>
                }
              >
                <ListItemIcon
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: "unset",
                    p: 1,
                  }}
                >
                  <Render if={
                    selectedTab?.type === "collection" && selectedTab.collection === c.name && selectedTab.database === c?.database
                  } then={
                    <FolderOpen sx={{ fontSize: "0.9rem" }} />
                  } else={
                    <Folder sx={{ fontSize: "0.9rem" }} />
                  } />
                </ListItemIcon>
                <ListItemText
                  primary={c?.name}
                  secondary={c?.database}
                  primaryTypographyProps={{
                    color: "text.primary",
                    fontSize: "0.8rem",
                    flexGrow: 1,
                  }}
                  secondaryTypographyProps={{
                    color: "text.secondary",
                    fontSize: "0.7rem",
                  }}
                />
              </ListItem>
            ))}
          </List>
        }
        else={
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1,
              px: 1,
            }}
          >
            <Render
              if={collectionSearch.length > 0}
              then={
                <>
                  <Typography variant="body2" color="textSecondary">
                    No collections found, try searching for something else
                  </Typography>
                  <Typography
                    variant={"caption"}
                    color={"textSecondary"}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    Press <KeyCombo keyCombo={"Esc"} size={"small"} /> to clear
                    search
                  </Typography>
                </>
              }
              else={
                <Typography variant="body2" color="textSecondary">
                  No pinned collections found
                </Typography>
              }
            />
          </Box>
        }
      />
    </MongoSidebarModulePanelTemplate>
  );
};
