import * as React from "react";
import { FC, MouseEvent, useCallback, useMemo, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  mongoCollectionListAtom,
  mongoDatabaseListAtom,
  mongoForceNewDatabaseAtom, mongoSelectedDatabaseAtom,
  openDatabaseAtom,
  selectedConnectionAtom
} from "@/store";
import {
  alpha,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  InputAdornment,
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
import { SizeDisplay } from "@/components/common";
import { IMongoDatabaseStats } from "@shared";
import {
  Abc,
  Add,
  Delete,
  MoreVert,
  Numbers,
  OpenInNew,
  Search,
  Storage,
  Tab,
} from "@mui/icons-material";
import { useContextMenu } from "@/hooks";
import { useDialogManager } from "@/managers";

interface IFilteredDatabases extends IMongoDatabaseStats {
  name: string;
  collections: number;
  indexes: number;
}

type TSortBy = "name" | "collections" | "indexes" | "sizeOnDisk";
type TSortOrder = "asc" | "desc";

const RowContextMenu: FC<{ databaseName: string }> = ({ databaseName }) => {
  const setSelectedDatabase = useSetAtom(mongoSelectedDatabaseAtom);
  const openDatabase = useSetAtom(openDatabaseAtom);

  const { hideContextMenu } = useContextMenu();
  const { openDialog } = useDialogManager();

  const handleOpenDatabase = (type: "replace" | "new"): void => {
    openDatabase(databaseName, type);
    hideContextMenu();
  };

  const onDropDatabase = (): void => {
    setSelectedDatabase(databaseName);
    openDialog("dropMongoDatabase");
    hideContextMenu();
  };
  return (
    <List dense disablePadding>
      <ListItemButton onClick={() => handleOpenDatabase("replace")}>
        <ListItemText
          primary={
            <>
              <Tab sx={{ fontSize: "0.9rem" }} />
              {`Open ${databaseName}`}
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
      <ListItemButton onClick={() => handleOpenDatabase("new")}>
        <ListItemText
          primary={
            <>
              <OpenInNew sx={{ fontSize: "0.9rem" }} />
              {`Open ${databaseName} in new tab`}
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
      <ListItemButton onClick={onDropDatabase}>
        <ListItemText
          primary={
            <>
              <Delete sx={{ fontSize: "0.9rem" }} />
              {`Drop ${databaseName}`}
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

const MongoDatabaseListRow: FC<IFilteredDatabases> = ({
  name,
  collections,
  indexes,
  sizeOnDisk,
}) => {
  const openDatabase = useSetAtom(openDatabaseAtom);

  const { showContextMenu } = useContextMenu();

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
          content: <RowContextMenu databaseName={name} />,
        },
      );
    },
    [name, showContextMenu],
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
          content: <RowContextMenu databaseName={name} />,
        },
      );
    },
    [name, showContextMenu],
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
      onClick={() => openDatabase(name, "replace")}
      onContextMenu={onContextMenu}
    >
      <TableCell>
        <Typography variant="body2" noWrap>
          {name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{collections}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{indexes}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          <SizeDisplay size={sizeOnDisk || 0} />
        </Typography>
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

export const MongoConnectionTanPanel: FC = () => {
  const connection = useAtomValue(selectedConnectionAtom);
  const { databases } = useAtomValue(mongoDatabaseListAtom);
  const collections = useAtomValue(mongoCollectionListAtom);

  const setForceNewDb = useSetAtom(mongoForceNewDatabaseAtom);

  const { openDialog } = useDialogManager();

  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<TSortBy>("name");
  const [sortOrder, setSortOrder] = useState<TSortOrder>("asc");

  const filteredDatabases = useMemo<IFilteredDatabases[]>(() => {
    const filtered = Object.entries(databases).map(([name, stats]) => {
      const dbCollections = collections.filter((collection) =>
        collection.name.startsWith(name),
      );
      return {
        name,
        collections: dbCollections.length,
        indexes: dbCollections.reduce(
          (acc, curr) => acc + curr.numOfIndexes,
          0,
        ),
        ...stats,
      };
    });

    if (!search.length) return filtered;

    return filtered.filter((db) => new RegExp(search, "i").test(db.name));
  }, [databases, collections, search]);

  const sortedDatabases = useMemo<IFilteredDatabases[]>(() => {
    return filteredDatabases.sort((a, b) => {
      if (sortBy === "name")
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      if (sortBy === "collections")
        return sortOrder === "asc"
          ? a.collections - b.collections
          : b.collections - a.collections;
      if (sortBy === "indexes")
        return sortOrder === "asc"
          ? a.indexes - b.indexes
          : b.indexes - a.indexes;
      if (sortBy === "sizeOnDisk")
        return sortOrder === "asc"
          ? (a.sizeOnDisk || 0) - (b.sizeOnDisk || 0)
          : (b.sizeOnDisk || 0) - (a.sizeOnDisk || 0);
      return 0;
    });
  }, [filteredDatabases, sortBy, sortOrder]);

  const handleNewDatabaseClick = (): void => {
    setForceNewDb(true);
    openDialog("createMongoDatabase");
  };

  const requestSort = useCallback(
    (property: TSortBy) => {
      const isAsc = sortBy === property && sortOrder === "asc";
      setSortOrder(isAsc ? "desc" : "asc");
      setSortBy(property);
    },
    [sortBy, sortOrder],
  );

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
          <Typography variant="body2">
            {connection?.name ?? "Connection"}
          </Typography>
        </Breadcrumbs>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add sx={{ fontSize: "0.9rem" }} />}
            onClick={handleNewDatabaseClick}
          >
            Create Database
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
                  {sortedDatabases.length} of {Object.keys(databases).length}
                </Typography>
              </InputAdornment>
            ),
          },
        }}
      />
      <TableContainer sx={{ flex: 1 }}>
        <Table size={"small"}>
          <TableHead sx={{
            backgroundColor: (theme) =>
              alpha(theme.palette.primary.main, 0.2),
            color: "text.primary",
            "& th": {
              fontWeight: "bold",
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.2),
            },
          }}>
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
                active={sortBy === "collections"}
                direction={sortBy === "collections" ? sortOrder : "asc"}
                onClick={() => requestSort("collections")}
                sx={{
                  gap: 1,
                }}
              >
                <Numbers sx={{ fontSize: "0.9rem" }} />
                Collections
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === "indexes"}
                direction={sortBy === "indexes" ? sortOrder : "asc"}
                onClick={() => requestSort("indexes")}
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
                active={sortBy === "sizeOnDisk"}
                direction={sortBy === "sizeOnDisk" ? sortOrder : "asc"}
                onClick={() => requestSort("sizeOnDisk")}
                sx={{
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Storage sx={{ fontSize: "0.9rem" }} />
                Size
              </TableSortLabel>
            </TableCell>
          </TableHead>
          <TableBody>
            {sortedDatabases.map((db) => (
              <MongoDatabaseListRow key={db.name} {...db} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
