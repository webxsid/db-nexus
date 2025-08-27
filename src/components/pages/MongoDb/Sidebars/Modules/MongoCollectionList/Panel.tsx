import {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  IMongoDatabaseTab,
  mongoActiveTabsAtom,
  mongoCollectionListAtom,
  mongoDatabaseListAtom,
  mongoForceNewDatabaseAtom,
  mongoPinnedTabsAtom,
  mongoSelectedTabAtom,
  openCollectionAtom,
  TMongoCollectionListAtom,
  TMongoTab,
} from "@/store";
import {
  alpha,
  Box,
  Checkbox,
  Collapse,
  darken,
  IconButton,
  InputAdornment,
  lighten,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Render from "@/components/common/Render.tsx";
import {
  Add,
  ChevronRight,
  Folder,
  FolderOpen,
  MoreVert,
  PushPin,
  PushPinOutlined,
} from "@mui/icons-material";
import { HotkeyButton, TransparentTextField } from "@/components/common";
import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";
import { MongoSidebarModulePanelTemplate } from "../Templates";
import { v4 } from "uuid";
import { useDialogManager } from "@/managers";

interface IFilteredCollectionItem {
  id: string;
  label: string;
  children: TMongoCollectionListAtom;
}

interface IMongoCollectionListButtonProps {
  collection: TMongoCollectionListAtom[0];
  openCollection: (collection: string, database: string) => void;
  selected?: boolean;
}

const MongoCollectionListButton: FC<IMongoCollectionListButtonProps> = ({
  collection,
  openCollection,
  selected,
}) => {
  const activeTabs = useAtomValue(mongoActiveTabsAtom);

  const isOpen = useMemo<boolean>(() => {
    return activeTabs.some(
      (tab) =>
        tab.type === "collection" &&
        tab.collection === collection.name &&
        tab.database === collection.database,
    );
  }, [activeTabs, collection]);

  const [pinnedCollections, setPinnedCollections] =
    useAtom(mongoPinnedTabsAtom);

  const isPinned = useMemo<boolean>(() => {
    return pinnedCollections.some(
      (c) => c.name === collection.name && c.database === collection.database,
    );
  }, [pinnedCollections, collection]);




  const pinCollection = useCallback(
    (e: MouseEvent, targetCollection: TMongoCollectionListAtom[0]) => {
      e.stopPropagation();
      e.preventDefault();
      setPinnedCollections((prev) => {
        if (isPinned) {
          return prev.filter(
            (c) =>
              c.name !== collection.name && c.database !== collection.database,
          );
        }
        return [...prev, targetCollection];
      });
    },
    [isPinned, collection, setPinnedCollections],
  );

  return (
    <ListItemButton
      key={collection.name}
      id={`collection-${collection.database}-${collection.name}`}
      dense
      disableGutters
      sx={{
        position: "sticky",
        top: 0,
        pr: 0.5,
        pl: 2,
        py: 0,
        borderRadius: 2,
      }}
      onClick={() => openCollection(collection.name, collection.database)}
      selected={selected}
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
        <Render
          if={isOpen}
          then={<FolderOpen sx={{ fontSize: "1rem" }} />}
          else={<Folder sx={{ fontSize: "1rem" }} />}
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Tooltip
              title={collection.name}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.primary",
                  fontSize: "0.8rem",
                  flexGrow: 1,
                  maxWidth: "calc(100% - 40px)",
                }}
                noWrap
                role={"button"}
              >
                {collection.name}
              </Typography>
            </Tooltip>
            <Tooltip
              title={
                isPinned
                  ? "Unpin collection"
                  : "Pin collection"
              }>
              <IconButton
                size={"small"}
                sx={{
                  p: 0.5,
                  borderRadius: 2,
                  height: "100%",
                }}
                onClick={(e) => pinCollection(e, collection)}
              >
                <Checkbox
                  sx={{ p: 0 }}
                  checked={isPinned}
                  icon={
                    <PushPinOutlined
                      sx={{ fontSize: "0.9rem", transform: "rotate(45deg)" }}
                    />
                  }
                  checkedIcon={
                    <PushPin
                      sx={{ fontSize: "0.9rem", transform: "rotate(45deg)" }}
                    />
                  }
                />
              </IconButton>
            </Tooltip>
            <IconButton
              size={"small"}
              sx={{
                p: 0.5,
                borderRadius: 2,
                height: "100%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVert sx={{ fontSize: "0.9rem" }} />
            </IconButton>
          </Box>
        }
      />
    </ListItemButton>
  );
};

export const MongoCollectionListPanel: FC = () => {
  const { databases } = useAtomValue(mongoDatabaseListAtom);
  const collections = useAtomValue(mongoCollectionListAtom);
  const [activeTabs, setActiveTabs] = useAtom(mongoActiveTabsAtom);
  const [selectedTabId, setSelectedTabId] = useAtom(mongoSelectedTabAtom);
  const forceNewDatabase = useSetAtom(mongoForceNewDatabaseAtom);
  const openCollectionFromState = useSetAtom(openCollectionAtom);

  const { openDialog, closeDialog } = useDialogManager();

  const selectedTab = useMemo<TMongoTab | undefined>(() => {
    return activeTabs.find((tab) => tab.id === selectedTabId);
  }, [selectedTabId, activeTabs]);

  const [collectionSearch, setCollectionSearch] = useState<string>("");
  const [filteredCollections, setFilteredCollections] = useState<
    IFilteredCollectionItem[]
  >([]);

  const [expandedDbs, setExpandedDbs] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const theme = useTheme();

  const searchRef = useRef<HTMLDivElement>(null);

  const handleExpandDb = (itemId: string): void => {
    if (expandedDbs.includes(itemId)) {
      setExpandedDbs(expandedDbs.filter((id) => id !== itemId));
    } else {
      setExpandedDbs([...expandedDbs, itemId]);
    }
  };

  const getActiveColor = (dbName: string): string => {
    const index = Object.keys(databases).indexOf(dbName);
    const primaryColor = theme.palette.primary.main;

    if (index === -1) {
      return primaryColor; // Default to primary color if dbName is not found
    }

    // Generate a unique color for each index by alternating between darken and lighten
    const factor = 0.1 * (index % 10); // Ensure factors remain between 0 and 1
    const colorInRGB =
      index % 2 === 0
        ? lighten(primaryColor, factor)
        : darken(primaryColor, factor);

    return alpha(colorInRGB, 0.3);
  };

  const clearSearch = useCallback(function onClearSearch() {
    setCollectionSearch("");
  }, []);

  const focusSearch = useCallback(function onFocusSearch() {
    searchRef.current?.focus();
  }, []);

  const onNewDbClick = useCallback(function handleOnNewDbClick() {
    forceNewDatabase(true);
    openDialog("createMongoDatabase")
  }, [forceNewDatabase, openDialog])

  const openCollection = useCallback(
    (collection: string, database: string) => {
      openCollectionFromState(
        collection,
        database,
        "new"
      )
    },
    [openCollectionFromState],
  );

  const openDatabase = useCallback(
    (database: string) => {
      const existingTab = activeTabs.find(
        (tab) => tab.type === "database" && tab.database === database,
      );

      if (existingTab) {
        setSelectedTabId(existingTab.id);
        return;
      }
      const newTabData: IMongoDatabaseTab = {
        type: "database",
        id: v4(),
        database,
      };
      setActiveTabs((prevTabs) => [...prevTabs, newTabData]);
      setSelectedTabId(newTabData.id);
    },
    [setActiveTabs, setSelectedTabId, activeTabs],
  );

  useEffect(() => {
    const filtered =
      collectionSearch.length > 0
        ? collections.filter((c) => c.name.includes(collectionSearch))
        : collections;

    const groups: IFilteredCollectionItem[] = Object.keys(databases)
      .map((dbName) => {
        const dbCollections = filtered.filter((c) => c.database === dbName);
        return dbCollections.length > 0 || collectionSearch.length === 0
          ? {
            id: dbName,
            label: dbName,
            children: dbCollections,
          }
          : null;
      })
      .filter((group): group is IFilteredCollectionItem => group !== null); // Removes null entries

    setFilteredCollections(groups);
  }, [collectionSearch, collections, databases]);

  useEffect(() => {
    if (!selectedTab) return;

    if (selectedTab.type !== "database" && selectedTab.type !== "collection")
      return;
    const query =
      selectedTab.type === "database"
        ? `#db-${selectedTab.id}`
        : `#collection-${selectedTab.database}-${selectedTab.id}`;

    if (!query) return;

    const element = document.querySelector(query);
    setExpandedDbs((prev) => {
      if (prev.includes(selectedTab.database)) return prev;
      return [...prev, selectedTab.database];
    });

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
      label={"Databases"}
      moduleKey={"collection-list"}
      side={"left"}
      headerActions={[
        {
          icon: <Add />,
          label: "Create Database",
          onClick: onNewDbClick
        },
      ]}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
        }}
      >
        <TransparentTextField
          placeholder={"Search databases.."}
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
      <Box sx={{ overflowY: "auto", flex: 1, pb: "100%", borderRadius: 2, overflowAnchor: "none", overflowX: "hidden" }}>
        <Render
          if={filteredCollections.length > 0}
          then={
            <List
              dense
            >
              {filteredCollections.map((db) => (
                <Box
                  key={db.id}
                  id={`db-${db.id}`}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    transition: "background-color 0.3s",
                  }}
                >
                  <Box
                    className={"mongo-database-list-item"}
                    id={`database-${db.id}`}
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "background.paper",
                      borderRadius: 2,
                    }}
                  >
                    <ListItem
                      dense
                      disableGutters
                      sx={{
                        p: 0,
                        borderRadius: 2,
                        backgroundColor:
                          selectedTab?.type === "database" || selectedTab?.type === "collection" &&
                            selectedTab.database === db.id
                            ? getActiveColor(db.id)
                            : "transparent",
                        transition: "background-color 0.3s",
                        "& .secondary-action": {
                          opacity: 0,
                          transition: "opacity 0.3s",
                          "& svg": {
                            fontSize: "0.9rem",
                          },
                        },
                        "&:hover": {
                          backgroundColor: expandedDbs.includes(db.id)
                            ? `${getActiveColor(db.id)}`
                            : lighten(getActiveColor(db.id), 0.1),

                          "& .secondary-action": {
                            opacity: 1,
                          },
                        },
                      }}
                      secondaryAction={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 0.7,
                          }}
                          className={"secondary-action"}
                        >
                          <IconButton size={"small"} sx={{ padding: 0 }}>
                            <Add />
                          </IconButton>
                          <IconButton size={"small"} sx={{ padding: 0 }}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemIcon
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          minWidth: "unset",
                          p: 1,
                        }}
                        role={"button"}
                        onClick={(_e) => handleExpandDb(db.id)}
                      >
                        <ChevronRight
                          fontSize={"small"}
                          sx={{
                            transition: "transform 0.3s",
                            transform: expandedDbs.includes(db.id)
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={db.label}
                        onClick={() => openDatabase(db.id)}
                        slotProps={{
                          primary: {
                            variant: "body2",
                            noWrap: true,
                            color: "text.primary",
                            fontSize: "0.9rem",
                            role: "button",
                            sx: {
                              cursor: "pointer",
                              userSelect: "none",
                            },

                          }
                        }}
                      />
                    </ListItem>
                  </Box>
                  <Collapse in={expandedDbs.includes(db.id)} unmountOnExit sx={{ overflowAnchor: "none" }}>
                    <List dense disablePadding sx={{
                      borderRadius: 2,
                      pt: "12px",
                      transform: "translateY(-15px)",
                      position: "relative",
                    }}>
                      <Render
                        if={db.children.length > 0}
                        then={
                          <>
                            {db.children.map((c) => (
                              <MongoCollectionListButton
                                key={`${c.database}-${c.name}`}
                                collection={c}
                                openCollection={openCollection}
                                selected={
                                  selectedTab?.type === "collection" &&
                                  selectedTab.collection === c.name &&
                                  selectedTab.database === db.id
                                }
                              />
                            ))}
                          </>
                        }
                        else={
                          <ListItem
                            dense
                            disableGutters
                            sx={{
                              borderRadius: 2,
                              pl: 1.5,
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    verticalAlign: "middle",
                                    useSelect: "none",
                                  }}
                                  noWrap
                                >
                                  No collections found,
                                  <Typography
                                    role={"button"}
                                    variant={"body2"}
                                    color={"primary"}
                                    sx={{
                                      cursor: "pointer",
                                      userSelect: "none",
                                      "&:hover": {
                                        textDecoration: "underline",
                                      },
                                    }}
                                  >
                                    create one
                                  </Typography>
                                </Typography>
                              }
                            />
                          </ListItem>
                        }
                      />
                    </List>
                  </Collapse>
                </Box>
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
                  <>
                    <Typography variant="body2" color="textSecondary">
                      No collections found
                    </Typography>

                    <HotkeyButton
                      onClick={() => { }}
                      keyBindings={["Meta+n"]}
                      skipBind={true}
                      hotKeySize="smaller"
                      variant={"outlined"}
                      size={"small"}
                      tooltip={"Create a new database"}
                    >
                      Create Database
                    </HotkeyButton>
                  </>
                }
              />
            </Box>
          }
        />
      </Box>
    </MongoSidebarModulePanelTemplate>
  );
};
