import * as React from "react";
import { FC, MouseEvent, useCallback, useMemo, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  mongoCollectionListAtom,
  mongoNewDatabaseAtom, mongoPinnedTabsAtom,
  mongoSelectedCollectionAtom,
  mongoSelectedDatabaseAtom,
  openCollectionAtom,
  openConnectionAtom,
  openDatabaseAtom,
  selectedConnectionAtom, TMongoCollectionListAtom
} from "@/store";
import {
  alpha,
  Box,
  Breadcrumbs,
  Button,
  darken,
  Divider,
  IconButton,
  InputAdornment,
  lighten,
  List,
  ListItemButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { LargeNumberDisplay, SizeDisplay } from "@/components/common";
import {
  Abc,
  Add,
  Delete,
  MoreVert,
  Numbers,
  OpenInNew, PushPin, PushPinOutlined,
  Search,
  Storage,
  Tab
} from "@mui/icons-material";
import { useContextMenu } from "@/hooks";
import { useDialogManager } from "@/managers";

type TSortBy = "name" | "numOfDocuments" | "numOfIndexes" | "size";
type TSortOrder = "asc" | "desc";

const RowContextMenu: FC<{ collection: TMongoCollectionListAtom[0], isPinned: boolean }> = ({
  collection,
  isPinned
}) => {
  const setSelectedDatabase = useSetAtom(mongoSelectedDatabaseAtom);
  const setSelectedCollection = useSetAtom(mongoSelectedCollectionAtom);
  const openCollection = useSetAtom(openCollectionAtom);

  const setPinnedCollections = useSetAtom(mongoPinnedTabsAtom);


  const { hideContextMenu } = useContextMenu();
  const { openDialog } = useDialogManager();

  const handleOpenCollection = (type: "replace" | "new"): void => {
    openCollection(collection.name, collection.database, type);
    hideContextMenu();
  };

  const onDropCollection = (): void => {
    setSelectedDatabase(collection.database);
    setSelectedCollection(collection.name);
    openDialog("dropMongoCollection");
    hideContextMenu();
  };

  const handleTogglePin = (): void => {
    setPinnedCollections((prev) => {
      if (isPinned) {
        return prev.filter((c) => c.name !== collection.name);
      }
      return [...prev, collection];
    });
    hideContextMenu();
  }
  return (
    <List dense disablePadding>
      <ListItemButton onClick={() => handleOpenCollection("replace")}>
        <ListItemText
          primary={
            <>
              <Tab sx={{ fontSize: "0.9rem" }} />
              {`Open ${collection.name}`}
            </>
          }
          primaryTypographyProps={{
            variant: "body2",
            component: "span",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        />
      </ListItemButton>
      <ListItemButton onClick={() => handleOpenCollection("new")}>
        <ListItemText
          primary={
            <>
              <OpenInNew sx={{ fontSize: "0.9rem" }} />
              {`Open ${collection.name} in new tab`}
            </>
          }
          primaryTypographyProps={{
            variant: "body2",
            component: "span",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        />
      </ListItemButton>
      <ListItemButton onClick={handleTogglePin}>
        <ListItemText
          primary={
            <>
              {
                !isPinned ? <PushPin sx={{ fontSize: "0.9rem", transform: "rotate(45deg)" }} /> : <PushPinOutlined sx={{ fontSize: "0.9rem", transform: "rotate(45deg)" }} />
              }
              {isPinned ? "Unpin" : "Pin"}
            </>
          }
          primaryTypographyProps={{
            variant: "body2",
            component: "span",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        />
      </ListItemButton>
      <Divider flexItem />
      <ListItemButton onClick={onDropCollection}>
        <ListItemText
          primary={
            <>
              <Delete sx={{ fontSize: "0.9rem" }} />
              {`Drop ${collection.name}`}
            </>
          }
          primaryTypographyProps={{
            variant: "body2",
            component: "span",
            color: "error",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        />
      </ListItemButton>
    </List>
  );
};

const MongoCollectionListRow: FC<{ collection: TMongoCollectionListAtom[0] }> = ({
  collection
}) => {
  const openDatabase = useSetAtom(openDatabaseAtom);
  const pinnedCollections = useAtomValue(mongoPinnedTabsAtom);

  const isPinned = useMemo(() => pinnedCollections.some((c) => c.name === collection.name), [pinnedCollections, collection]);

  const { showContextMenu } = useContextMenu();

  const openCollection = useSetAtom(openCollectionAtom);
  const onContextMenu = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      showContextMenu(
        {
          mouseX: e.clientX - 2,
          mouseY: e.clientY - 4,
        },
        {
          content: (
            <RowContextMenu collection={collection} isPinned={isPinned} />
          ),
        },
      );
    },
    [showContextMenu, collection, isPinned],
  );

  const onContextMenuButton = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      showContextMenu(
        {
          mouseX: target.getBoundingClientRect().left,
          mouseY: target.getBoundingClientRect().bottom,
        },
        {
          content: (
            <RowContextMenu collection={collection} isPinned={isPinned} />
          ),
        },
      );
    },
    [showContextMenu, collection, isPinned],
  );

  return (
    <TableRow
      role="button"
      sx={{
        cursor: "pointer",
        position: "relative",
        "&:hover": {
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
        },
        "& td": {
          py: 1.5,
        },
        "&:hover .context-menu-button": {
          opacity: 1,
        },
      }}
      onClick={() => openCollection(collection.name, collection.database, "replace")}
      onContextMenu={onContextMenu}
    >
      <TableCell>
        <Typography variant="body2" noWrap sx={{
          display: "flex",
          alignItems: "center",
          gap: 1
        }}>
          {collection.name}
          {
            isPinned ? <PushPin sx={{ fontSize: "0.9rem", transform: "rotate(45deg)" }} /> : null
          }
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          <LargeNumberDisplay value={collection.numOfDocuments} />
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{collection.numOfIndexes}</Typography>
      </TableCell>
      <TableCell>
        <SizeDisplay size={collection.size} />
      </TableCell>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          opacity: 0,
          transition: "opacity 0.2s",
        }}
        className="context-menu-button"
      >
        <IconButton onClick={onContextMenuButton}>
          <MoreVert sx={{ fontSize: "0.9rem" }} />
        </IconButton>
      </Box>
    </TableRow>
  );
};

export interface IMongoDatabaseTabPanelProps {
  databaseName: string;
}

export const MongoDatabaseTabPanel: FC<IMongoDatabaseTabPanelProps> = ({
  databaseName,
}) => {
  const connection = useAtomValue(selectedConnectionAtom);
  const collections = useAtomValue(mongoCollectionListAtom);

  const setNewDb = useSetAtom(mongoNewDatabaseAtom);
  const openConnection = useSetAtom(openConnectionAtom);

  const { openDialog } = useDialogManager();

  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<TSortBy>("name");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("asc");

  const filteredCollections = useMemo<TMongoCollectionListAtom>(() => {
    const filtered = collections
      .filter((c) => c.database === databaseName)

    if (!search.length) return filtered;

    return filtered.filter((c) => new RegExp(search, "i").test(c.name));
  }, [collections, search, databaseName]);

  const sortedCollections = useMemo<TMongoCollectionListAtom>(() => {
    return filteredCollections.sort((a, b) => {
      if (sortBy === "name")
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      if (sortBy === "numOfDocuments")
        return sortOrder === "asc" ? a.numOfDocuments - b.numOfDocuments : b.numOfDocuments - a.numOfDocuments;
      if (sortBy === "numOfIndexes")
        return sortOrder === "asc"
          ? a.numOfIndexes - b.numOfIndexes
          : b.numOfIndexes - a.numOfIndexes;
      if (sortBy === "size")
        return sortOrder === "asc"
          ? (a.size || 0) - (b.size || 0)
          : (b.size || 0) - (a.size || 0);
      return 0;
    });
  }, [filteredCollections, sortBy, sortOrder]);

  const handleNewCollectionClick = (): void => {
    setNewDb(databaseName);
    openDialog("createMongoCollection");
  };

  const requestSort = useCallback(
    (property: TSortBy) => {
      const isAsc = sortBy === property && sortOrder === "asc";
      setSortOrder(isAsc ? "desc" : "asc");
      setSortBy(property);
    },
    [sortBy, sortOrder],
  );
  console.log("MongoDatabaseTabPanel -> collections", collections)

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          width: "100%",
          pl: 0.8,
          borderRadius: 2,
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Typography
            variant="body2"
            role="button"
            onClick={() => openConnection("replace")}
            sx={{
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {connection?.name ?? "Connection"}
          </Typography>
          <Typography variant="body2">{databaseName}</Typography>
        </Breadcrumbs>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add sx={{ fontSize: "0.9rem" }} />}
            onClick={handleNewCollectionClick}
          >
            Create Collection
          </Button>
        </Box>
      </Box>
      <TextField
        placeholder="Search"
        variant="outlined"
        value={search}
        size="small"
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" component="span">
                  {sortedCollections.length} collections
                </Typography>
              </InputAdornment>
            ),
          },
        }}
      />
      <TableContainer sx={{ flex: 1 }}>
        <Table size={"small"} stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                color: "text.primary",
                "& th": {
                  fontWeight: "bold",
                  backgroundColor: (theme) => darken(theme.palette.primary.main, 0.5),
                },
              }}
            >
              <TableCell>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? sortOrder : "asc"}
                  onClick={() => requestSort("name")}
                  sx={{
                    gap: 1,
                  }}
                >
                  <Abc />
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "numOfDocuments"}
                  direction={sortBy === "numOfDocuments" ? sortOrder : "asc"}
                  onClick={() => requestSort("numOfDocuments")}
                  sx={{
                    gap: 1,
                  }}
                >
                  <Numbers sx={{ fontSize: "0.9rem" }} />
                  Documents
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "numOfIndexes"}
                  direction={sortBy === "numOfIndexes" ? sortOrder : "asc"}
                  onClick={() => requestSort("numOfIndexes")}
                  sx={{
                    gap: 1,
                  }}
                >
                  <Numbers sx={{ fontSize: "0.9rem" }} />
                  Indexes
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "size"}
                  direction={sortBy === "size" ? sortOrder : "asc"}
                  onClick={() => requestSort("size")}
                  sx={{
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Storage sx={{ fontSize: "0.9rem" }} />
                  Size
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCollections.map((c) => (
              <MongoCollectionListRow key={c.name} collection={c} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
