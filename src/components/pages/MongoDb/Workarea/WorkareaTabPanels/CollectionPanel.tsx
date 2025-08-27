import Render from "@/components/common/Render";
import StyledSelect from "@/components/common/StyledSelect";
import { useDialogManager } from "@/managers";
import {
  mongoCollectionTabStateLoadDocuments,
  mongoSelectedCollectionTabStateAtom,
  openConnectionAtom,
  openDatabaseAtom,
  selectedConnectionAtom,
  toggleDirtyMongoCollectionTabState,
  TPageSize,
  updateMongoCollectionTabStatePage,
  updateMongoCollectionTabStatePageSize
} from "@/store";
import { ChevronLeft, ChevronRight, Refresh } from "@mui/icons-material";
import { Breadcrumbs, Typography, Box, MenuItem, alpha, Tooltip, IconButton } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useCallback } from "react";
import { DocumentRenderer } from "../../Renderers";

export interface IMongoCollectionTabPanelProps {
  databaseName: string;
  collectionName: string;
}

export const MongoCollectionTabPanel: FC<IMongoCollectionTabPanelProps> = ({
  databaseName,
  collectionName,
}) => {

  const connection = useAtomValue(selectedConnectionAtom);

  const openConnection = useSetAtom(openConnectionAtom);
  const openDatabase = useSetAtom(openDatabaseAtom);

  const loadMongoDocuments = useSetAtom(mongoCollectionTabStateLoadDocuments);
  const updatePageSize = useSetAtom(updateMongoCollectionTabStatePageSize);
  const updatePage = useSetAtom(updateMongoCollectionTabStatePage);
  const toggleDirty = useSetAtom(toggleDirtyMongoCollectionTabState);

  const { isDialogOpen } = useDialogManager();

  const { page, pageSize, documents, isLoading, isDirty, query, options, error, selectedDocumentIndex } = useAtomValue(mongoSelectedCollectionTabStateAtom);

  const pageStart = (page - 1) * pageSize + 1;
  const pageEnd = Math.min(page * pageSize, documents.length);

  const handleReloadDocuments = useCallback(function handleReloadDocuments() {
    loadMongoDocuments(connection!.id);
  }, [loadMongoDocuments, connection]);

  const handlePageNext = useCallback(function handlePageNext() {
    if (page * pageSize < documents.length) {
      updatePage(page + 1);
    }
  }, [page, pageSize, documents.length, updatePage]);

  const handlePagePrevious = useCallback(function handlePagePrevious() {
    if (page > 1) {
      updatePage(page - 1);
    }
  }, [page, updatePage]);

  const handlePageSizeChange = useCallback(function handlePageSizeChange(newSize: TPageSize) {
    updatePageSize(newSize);
  }, [updatePageSize]);



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
          <Typography
            variant="body2"
            role="button"
            onClick={() => openDatabase(databaseName, "replace")}
            sx={{
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {databaseName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {collectionName}
          </Typography>
        </Breadcrumbs>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Reload Documents" placement="top">
              <IconButton
                size="small"
                onClick={handleReloadDocuments}
                disabled={isLoading || isDialogOpen()}
                sx={{
                  "& svg": {
                    color: (theme) => theme.palette.primary.main,
                    fontSize: "1.2rem",
                  },
                  "&:hover": {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {pageStart} - {pageEnd} of {documents.length}
            </Typography>

            <Tooltip title="Previous Page" placement="top">
              <IconButton
                size="small"
                onClick={handlePagePrevious}
                disabled={page <= 1 || isLoading || isDialogOpen()}
                sx={{
                  "& svg": {
                    color: (theme) => theme.palette.primary.main,
                    fontSize: "1.2rem",
                  },
                  "&:hover": {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
            </Tooltip>
            <Tooltip title="Next Page" placement="top">
              <IconButton
                size="small"
                onClick={handlePageNext}
                disabled={page * pageSize >= documents.length || isLoading || isDialogOpen()}
                sx={{
                  "& svg": {
                    color: (theme) => theme.palette.primary.main,
                    fontSize: "1.2rem",
                  },
                  "&:hover": {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ChevronRight />
              </IconButton>
            </Tooltip>
            <StyledSelect
              value={`${pageSize}`}
              onChange={(e) => {
                handlePageSizeChange(parseInt(e.target.value as string) as TPageSize);
              }}
              size="smaller"
              sx={{ minWidth: 80 }}
            >
              {
                ([10, 20, 50, 100] as TPageSize[]).map((size) => (
                  <MenuItem
                    key={size}
                    value={size}
                  >
                    {size}
                  </MenuItem>
                ))
              }
            </StyledSelect>
          </Box>
        </Box>
      </Box>

      <Box sx={{
        width: "100%",
        height: "100%",
        display: "grid",
        gap: 1,
        minHeight: 0,
        flex: 1,
        overflow: "hidden",
        gridTemplateRows: "repeat(12, 1fr)",
        gridTemplateColumns: "repeat(12, 1fr)",
      }}>
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
            height: "100%",
            borderRadius: 3,
            border: 1,
            borderColor: (theme) => alpha(theme.palette.primary.dark, 0.3),
            overflowY: "auto",
            [theme.containerQueries.md]: {
              gridRowStart: 1,
              gridRowEnd: "span 2",
              gridColumnStart: 1,
              gridColumnEnd: "span 12",
            },
            [theme.containerQueries.lg]: {
              gridRowStart: 1,
              gridRowEnd: "span 12",
              gridColumnStart: 1,
              gridColumnEnd: "span 4",
            }
          })}
        >
        </Box>
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            height: "100%",
            minHeight: 0,
            gap: 1,
            borderRadius: 3,
            overflowY: "hidden",
            [theme.containerQueries.md]: {
              gridRowStart: 3,
              gridRowEnd: "span 10",
              gridColumnStart: 1,
              gridColumnEnd: "span 12",
            },
            [theme.containerQueries.lg]: {
              gridRowStart: 1,
              gridRowEnd: "span 12",
              gridColumnStart: 5,
              gridColumnEnd: "span 8",
            }
          })}
        >
          <Render
            if={isLoading || !!error}
            then={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Render
                  if={!!error}
                  then={
                    <Typography variant="body2" color="error">
                      {error || "An error occurred while loading documents."}
                    </Typography>
                  }
                  else={
                    <Typography variant="body2" color="text.secondary">
                      Loading documents...
                    </Typography>
                  }
                />
              </Box>
            }
            else={
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  overflowY: "auto"
                }}
              >
                {/* Render documents here */}
                {documents.slice((page - 1) * pageSize, page * pageSize)
                  .filter((doc) => doc !== null && doc !== undefined)
                  .map((doc, index) => (
                    <DocumentRenderer
                      key={`doc-${(page - 1) * pageSize + index}`}
                      document={doc}
                      docIndex={(page - 1) * pageSize + index}
                      selected={selectedDocumentIndex === (page - 1) * pageSize + index}
                    />
                  ))}
              </Box>
            }
          />
        </Box>

      </Box>
    </Box >
  );
}
