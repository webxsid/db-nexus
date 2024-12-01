import { DatePicker, DBProviderSelector } from "@/components/common";
import Render from "@/components/common/Render";
import ShowDBProvider from "@/components/common/ShowDBProvider";
import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";
import { useContextMenu, usePopper } from "@/hooks";
import { CoreIpcEvents } from "@/ipc-events";
import { useDialogManager } from "@/managers";
import {
  connectionsAtom,
  isEditConnectionAtom,
  refreshConnectionsAtom, resetConfirmAtom,
  selectConnectionAtom
} from "@/store";
import { confirmAtom } from "@/store/atoms/confirm-dialog.atom";
import {
  Abc,
  Cable,
  Check,
  CheckCircle,
  CopyAll,
  Delete,
  Edit,
  Event,
  MoreVert,
  Search,
  Storage,
} from "@mui/icons-material";
import {
  Box,
  Chip,
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
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { ESupportedDatabases, IDatabaseConnection } from "@shared";
import { useAtomValue, useSetAtom } from "jotai";
import moment, { Moment } from "moment";
import * as React from "react";
import { FC, useState } from "react";
import { toast } from "react-toastify";

interface IRowContextMenuProps {
  connection?: IDatabaseConnection<unknown>;
  handleClose: () => void;
}
const RowContextMenu: FC<IRowContextMenuProps> = ({
  connection,
  handleClose,
}) => {
  const selectConnection = useSetAtom(selectConnectionAtom);
  const setIsEdit = useSetAtom(isEditConnectionAtom);
  const refreshConnections = useSetAtom(refreshConnectionsAtom);
  const { openDialog } = useDialogManager();
  const setConfirmDialog = useSetAtom(confirmAtom);
  const resetConfirmDialog = useSetAtom(resetConfirmAtom);

  const onClose = React.useCallback((): void => {
    resetConfirmDialog();

    handleClose();
  }, [resetConfirmDialog, handleClose]);

  const handleCopyConnectionURI = async (): Promise<void> => {
    if(connection) {
      await navigator.clipboard.writeText(connection?.uri);
      toast.success("Connection URI copied to clipboard");
      onClose();
    }
  };

  const handleEditConnection = (): void => {
    if(connection) {
      selectConnection(connection.id);
      setIsEdit(true);
      openDialog("addMongoConnection");
      onClose();
    }
  };

  const handleDeleteConnection = (): void => {
    if(!connection) return;
    setConfirmDialog({
      open: true,
      title: `Delete Connection - ${connection.name}`,
      severity:"error",
      message:
        "Are you sure you want to delete this connection? This action cannot be undone.",
      confirmLabel: "Delete",
      isStrict: true,
      textToMatch: connection.name,
      onConfirm: async () => {
        try {
          const res = await CoreIpcEvents.removeConnection(
            connection.provider,
            connection.id,
          );
          if (!res.ok) {
            throw new Error("Failed to delete connection");
          }
          const connections = await CoreIpcEvents.listConnections();
          refreshConnections(connections.connections);
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete connection");
        }
        onClose();
      },
      cancelLabel: "Cancel",
      onCancel: onClose,
    });
  };

  const handleDuplicateConnection = (): void => {
    if(!connection) return;
    setConfirmDialog({
      open: true,
      title: `Duplicate Connection - ${connection.name}`,
      severity:"info",
      message:
        "Are you sure you want to duplicate this connection? This will create a new connection with the same details.",
      confirmLabel: "Duplicate",
      onConfirm: async () => {
        try {
          const res = await CoreIpcEvents.duplicateConnection(
            connection.provider,
            connection.id,
          );
          if (!res.ok) {
            throw new Error("Failed to duplicate connection");
          }
          const connections = await CoreIpcEvents.listConnections();
          refreshConnections(connections.connections);
        } catch (error) {
          console.error(error);
          toast.error("Failed to duplicate connection");
        }
        onClose();
      },
      cancelLabel: "Cancel",
      onCancel: onClose,
    });
  };

  return (
    <List dense disablePadding>
      <ListItemButton onClick={handleCopyConnectionURI}>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              component="span"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <CopyAll fontSize="small" />
              Copy Connection URI
            </Typography>
          }
        />
      </ListItemButton>
      <ListItemButton onClick={handleEditConnection}>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              component="span"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Edit fontSize="small" />
              Edit Connection
            </Typography>
          }
        />
      </ListItemButton>
      <ListItemButton onClick={handleDuplicateConnection}>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              component="span"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <CopyAll fontSize="small" />
              Duplicate Connection
            </Typography>
          }
        />
      </ListItemButton>
      <Divider />
      <ListItemButton onClick={handleDeleteConnection}>
        <ListItemText
          primary={
            <Typography
              variant="body2"
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "error.main",
              }}
            >
              <Delete fontSize="small" />
              Delete Connection
            </Typography>
          }
        />
      </ListItemButton>
    </List>
  );
};

interface IConnection {
  id: string;
  name: string;
  provider: string;
  uri: string;
  createdAt: Date;
  updatedAt: Date;
  lastConnectionAt?: Date;
  color?: string;
}

type TOrder = "asc" | "desc";
type TOrderBy = keyof IConnection;

export const ConnectionsTable: FC = () => {
  const savedConnections = useAtomValue(connectionsAtom);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<IConnection[]>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  /**
   * Filter states
   */
  const [providerFilter, setProviderFilter] = useState<ESupportedDatabases[]>(
    [],
  );
  const [providerFilterAnchor, setProviderFilterAnchor] =
    useState<null | HTMLElement>(null);
  const [updatedAtFilter, setUpdatedAtFilter] = useState<Moment | null>(null);
  const [updatedAtFilterEnd, setUpdatedAtFilterEnd] = useState<Moment | null>(
    null,
  );
  const [updateAtFilterAnchor, setUpdatedAtFilterAnchor] =
    useState<null | HTMLElement>(null);
  const [lastConnectionAtFilter, setLastConnectionAtFilter] =
    useState<Moment | null>(null);
  const [lastConnectionAtFilterEnd, setLastConnectionAtFilterEnd] =
    useState<Moment | null>(null);
  const [lastConnectionAtFilterAnchor, setLastConnectionAtFilterAnchor] =
    useState<null | HTMLElement>(null);

  /**
   * Sort states
   */
  const [order, setOrder] = useState<TOrder>("asc");
  const [orderBy, setOrderBy] = useState<TOrderBy>("name");

  /**
   * Pagination states
   */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /**
   * Popper and Context Menu hooks
   * @see usePopper
   * @see useContextMenu
   * @see useDialogManager
   */
  const { showPopper, hidePopper } = usePopper();
  const { showContextMenu, hideContextMenu } = useContextMenu();
  const { openDialog } = useDialogManager();

  /**
   * Handle sorting of the table
   * @param property
   * @returns void
   */
  const handleRequestSort = (property: keyof IConnection): void => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  /**
   * Handle changing the page
   * @param event
   * @param newPage
   * @returns void
   */
  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  /**
   * Handle changing the rows per page
   * @param event
   * @returns void
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * Filter connections based on the filter state
   * @returns IConnection[]
   * @see savedConnections
   */
  const sortedConnections = React.useMemo(() => {
    return [...searchResults].sort((a, b) => {

      if(!a || !b) return 0;
      const aOrderBy = a[orderBy];
      const bOrderBy = b[orderBy];

      if(!aOrderBy || !bOrderBy) return 0;

      if(typeof aOrderBy !==  typeof bOrderBy ) return 0;

      if (aOrderBy < bOrderBy) {
        return order === "asc" ? -1 : 1;
      }
      if (aOrderBy > bOrderBy) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [searchResults, order, orderBy]);

  /**
   * Paginate the connections
   * @returns IConnection[]
   * @see sortedConnections
   * @see page
   * @see rowsPerPage
   */
  const paginatedConnections = React.useMemo(() => {
    return sortedConnections.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [sortedConnections, page, rowsPerPage]);

  const handleRowContextMenu = (
    e: React.MouseEvent<HTMLTableRowElement | HTMLButtonElement> | null,
    id: string,
  ): void => {
    if(!e) return;
    e.preventDefault();
    e?.stopPropagation();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    showContextMenu(
      { mouseX, mouseY },
      {
        content: (
          <RowContextMenu
            connection={savedConnections.find(
              (connection) => connection.id === id,
            )}
            handleClose={() => {
              hideContextMenu();
            }}
          />
        ),
      },
    );
  };

  const resetFilters = (): void => {
    setSearchQuery("");
    setSearchTerm("");
    setProviderFilter([]);
    setUpdatedAtFilter(null);
    setLastConnectionAtFilter(null);
  };

  const standardFilters = React.useMemo(() => {
    return [
      {
        Label: "All",
        activeIf:
          providerFilter.length === 0 &&
          !updatedAtFilter &&
          !lastConnectionAtFilter,
        activeIcon: <CheckCircle fontSize="small" />,
        activate: () => resetFilters(),
      },
      {
        Label: "Provider",
        activeIf: providerFilter.length > 0,
        activate: (e: React.MouseEvent<HTMLDivElement>) => {
          setProviderFilterAnchor(e.currentTarget);
        },
        activeIcon: (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "background.default",
              width: 20,
              aspectRatio: 1,
              borderRadius: "50%",
            }}
          >
            <Typography
              variant="caption"
              component="span"
              fontWeight={"bold"}
              sx={{
                color: "primary.main",
              }}
            >
              {providerFilter.length}
            </Typography>
          </Box>
        ),
        setterComponent: (
          <DBProviderSelector
            open={Boolean(providerFilterAnchor)}
            anchorEl={providerFilterAnchor}
            onClose={() => setProviderFilterAnchor(null)}
            selectedProviders={providerFilter}
            setSelectedProviders={setProviderFilter}
          />
        ),
        onClear: () => setProviderFilter([]),
      },
      {
        Label: "Last Updated",
        activeIf: updatedAtFilter !== null,
        activeIcon: <Check fontSize="small" />,
        activate: (e: React.MouseEvent<HTMLDivElement>) => {
          setUpdatedAtFilterAnchor(e.currentTarget);
        },
        activeLabel:
          moment(updatedAtFilter).isValid() &&
          moment(updatedAtFilter).format("DD/MM/YYYY"),
        setterComponent: (
          <DatePicker
            open={Boolean(updateAtFilterAnchor)}
            anchorEl={updateAtFilterAnchor}
            onClose={() => setUpdatedAtFilterAnchor(null)}
            selectedStartDate={updatedAtFilter}
            setSelectedStartDate={setUpdatedAtFilter}
            selectedEndDate={updatedAtFilterEnd}
            setSelectedEndDate={setUpdatedAtFilterEnd}
          />
        ),
        onClear: () => setUpdatedAtFilter(null),
      },
      {
        Label: "Last Connection",
        activeIf: lastConnectionAtFilter !== null,
        activeIcon: <Check fontSize="small" />,
        activate: (e: React.MouseEvent<HTMLDivElement>) => {
          setLastConnectionAtFilterAnchor(e.currentTarget);
        },
        activeLabel:
          moment(lastConnectionAtFilter).isValid() &&
          moment(lastConnectionAtFilter).format("DD/MM/YYYY"),
        setterComponent: (
          <DatePicker
            open={Boolean(lastConnectionAtFilterAnchor)}
            anchorEl={lastConnectionAtFilterAnchor}
            onClose={() => setLastConnectionAtFilterAnchor(null)}
            selectedStartDate={lastConnectionAtFilter}
            setSelectedStartDate={setLastConnectionAtFilter}
            selectedEndDate={lastConnectionAtFilterEnd}
            setSelectedEndDate={setLastConnectionAtFilterEnd}
          />
        ),
        onClear: () => setLastConnectionAtFilter(null),
      },
    ];
  }, [
    providerFilter,
    updatedAtFilter,
    lastConnectionAtFilter,
    providerFilterAnchor,
    updateAtFilterAnchor,
    updatedAtFilterEnd,
    lastConnectionAtFilterAnchor,
    lastConnectionAtFilterEnd,
  ]);

  React.useEffect(() => {
    setSearchResults(savedConnections);
  }, [savedConnections]);

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchQuery(searchTerm);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  React.useEffect(() => {
    let results = savedConnections;

    if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      results = results.filter(
        (connection) =>
          regex.test(connection.name) || regex.test(connection.uri),
      );
    }

    if (providerFilter.length > 0) {
      results = results.filter((connection) =>
        providerFilter.includes(connection.provider),
      );
    }

    if (updatedAtFilter && updatedAtFilterEnd) {
      console.log(updatedAtFilter, updatedAtFilterEnd);
      results = results.filter((connection) =>
        moment(connection.updatedAt).isBetween(
          updatedAtFilter,
          updatedAtFilterEnd,
        ),
      );
    }

    if (lastConnectionAtFilter && lastConnectionAtFilterEnd) {
      results = results.filter((connection) =>
        moment(connection.lastConnectionAt).isBetween(
          lastConnectionAtFilter,
          lastConnectionAtFilterEnd,
        ),
      );
    }

    setSearchResults(results);
  }, [
    searchQuery,
    providerFilter,
    updatedAtFilter,
    updatedAtFilterEnd,
    lastConnectionAtFilter,
    lastConnectionAtFilterEnd,
    savedConnections,
  ]);

  const focusSearch = React.useCallback(function focusSearch() {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (searchResults.length === 0) {
      setPage(0);
    } else if (searchResults.length < page * rowsPerPage) {
      setPage(0);
    }
  }, [searchResults, page, rowsPerPage]);

  React.useEffect(() => {
    KeybindingManager.registerKeybinding("Meta+f", focusSearch);

    return () => KeybindingManager.unregisterKeybinding("Meta+f", focusSearch);
  }, [focusSearch]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          backgroundColor: "background.paper",
          borderRadius: 3,
          p: 1,
        }}
      >
        <TextField
          inputRef={inputRef}
          variant="outlined"
          placeholder="Search Connection"
          sx={{ borderRadius: 3 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" sx={{ gap: 2 }}>
                  <Typography variant="caption" component="span">
                    {paginatedConnections.length} of {savedConnections.length}
                  </Typography>
                  <KeyCombo keyCombo={"Meta+f"} size="small" />
                </InputAdornment>
              ),
            }
          }}
        />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", px: 1 }}>
          {standardFilters.map((filter) => (
            <>
              <Chip
                key={filter.Label}
                label={
                  filter.activeIf
                    ? filter.activeLabel || filter.Label
                    : filter.Label
                }
                color={filter.activeIf ? "primary" : "default"}
                icon={filter.activeIf ? filter.activeIcon : undefined}
                onClick={filter.activate}
                onDelete={filter.activeIf ? filter.onClear : undefined}
                sx={{
                  borderRadius: 2,
                  cursor: "pointer",
                }}
              />
              {filter.setterComponent ? filter.setterComponent : null}
            </>
          ))}
        </Box>
      </Box>
      <TableContainer sx={{ flex: 1 }}>
        <Table stickyHeader sx={{ width: "100%" }}>
          <TableHead>
            <TableRow
              sx={{
                border: "unset",
              }}
            >
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleRequestSort("name")}
                  aria-label="Sort by Connection Name"
                  sx={{
                    maxWidth: 200,
                    gap: 1,
                  }}
                >
                  <Abc />
                  Connection Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "provider"}
                  direction={orderBy === "provider" ? order : "asc"}
                  onClick={() => handleRequestSort("provider")}
                  aria-label="Sort by Provider"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Storage fontSize="small" />
                  Provider
                </TableSortLabel>
              </TableCell>
              <TableCell colSpan={2}>
                <TableSortLabel
                  active={orderBy === "uri"}
                  direction={orderBy === "uri" ? order : "asc"}
                  onClick={() => handleRequestSort("uri")}
                  aria-label="Sort by URI"
                  sx={{
                    gap: 1,
                  }}
                >
                  <Cable fontSize="small" />
                  Connection URI
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "updatedAt"}
                  direction={orderBy === "updatedAt" ? order : "asc"}
                  onClick={() => handleRequestSort("updatedAt")}
                  aria-label="Sort by Last Updated"
                  sx={{
                    gap: 1,
                  }}
                >
                  <Event fontSize="small" />
                  Last Updated
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "lastConnectionAt"}
                  direction={orderBy === "lastConnectionAt" ? order : "asc"}
                  onClick={() => handleRequestSort("lastConnectionAt")}
                  aria-label="Sort by Last Connection"
                  sx={{
                    gap: 1,
                  }}
                >
                  <Event fontSize="small" />
                  Last Connection
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedConnections.length > 0 ? (
              paginatedConnections.map((connection) => (
                <TableRow
                  key={connection.id}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "& .context-menu-trigger": {
                        opacity: 1,
                      },
                    },
                  }}
                  onContextMenu={(e) => handleRowContextMenu(e, connection.id)}
                >
                  <TableCell sx={{ maxWidth: 250 }}>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      {connection.color &&
                      connection.color !== "transparent" ? (
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: 1,
                            backgroundColor: connection.color,
                          }}
                        />
                      ) : null}
                      <Typography
                        variant="body1"
                        component="span"
                        noWrap
                        sx={{
                          maxWidth: 250,
                          height: "100%",
                        }}
                        onMouseEnter={(e) => {
                          showPopper(e.currentTarget, {
                            content: connection.name,
                          });
                        }}
                        onMouseLeave={hidePopper}
                      >
                        {connection.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" component="span">
                      <ShowDBProvider
                        provider={connection.provider}
                        showLogo
                        logoSx={{
                          width: "100%",
                        }}
                      />
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <Typography
                      variant="caption"
                      component="span"
                      noWrap
                      sx={{
                        maxWidth: 300,
                      }}
                    >
                      ***********************
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Render
                      if={!!connection.updatedAt}
                      then={
                        <Typography variant="caption" component="span">
                          {new Date(connection.updatedAt).toDateString()}
                        </Typography>
                      }
                      else={
                        <Typography variant="caption" component="span">
                          (Not Available)
                        </Typography>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Render
                      if={!!connection.lastConnectionAt}
                      then={
                        <Typography variant="caption" component="span">
                          {connection.lastConnectionAt?.toLocaleString()}
                        </Typography>
                      }
                      else={
                        <Typography variant="caption" component="span">
                          (Not Available)
                        </Typography>
                      }
                    />
                  </TableCell>
                  <Box
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      margin: "auto",
                      opacity: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="context-menu-trigger"
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => handleRowContextMenu(e, connection.id)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <Render
                  if={
                    !!(searchQuery ||
                    providerFilter.length > 0 ||
                    updatedAtFilter ||
                    lastConnectionAtFilter)
                  }
                  then={
                    <TableCell colSpan={6}>
                      <Typography
                        align="center"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        No results found for the current filter
                      </Typography>
                    </TableCell>
                  }
                  else={
                    <TableCell colSpan={6}>
                      <Typography
                        align="center"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        you haven't added any connections yet,{" "}
                        <Typography
                          color="primary"
                          component={"span"}
                          sx={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            userSelect: "none",
                          }}
                          onClick={() => openDialog("selectDbProvider")}
                          role="button"
                          tabIndex={0}
                          aria-label="Add a new connection"
                        >
                          add a new connection
                        </Typography>
                      </Typography>
                    </TableCell>
                  }
                />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={savedConnections.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        aria-label="Table pagination"
      />
    </Box>
  );
};
