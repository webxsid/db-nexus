import Render from "@/components/common/Render";
import StyledSelect from "@/components/common/StyledSelect";
import { useDialogManager } from "@/managers";
import { mongoSelectedCollectionTabStateAtom, openConnectionAtom, openDatabaseAtom, selectedConnectionAtom, TPageSize } from "@/store";
import { ChevronLeft, ChevronRight, Refresh } from "@mui/icons-material";
import { Breadcrumbs, Typography, Box, MenuItem, alpha, Grid2, IconButton } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useRef, useState } from "react";
import { DocumentRenderer } from "../../Renderers/Document.Renderer";

export interface IMongoCollectionTabPanelProps {
  databaseName: string;
  collectionName: string;
}

export const MongoCollectionTabPanel: FC<IMongoCollectionTabPanelProps> = ({
  databaseName,
  collectionName,
}) => {
  const [openPageSizeMenu, setOpenPageSizeMenu] = useState(false);
  const pageSizeAnchorElRef = useRef();
  const connection = useAtomValue(selectedConnectionAtom);

  const openConnection = useSetAtom(openConnectionAtom);
  const openDatabase = useSetAtom(openDatabaseAtom);

  const { openDialog } = useDialogManager();

  const state = useAtomValue(mongoSelectedCollectionTabStateAtom);
  if (!state) {
    console.log("Current state:", state);
    return null;
  }

  const { page, pageSize, documents, isLoading, isDirty, query, options, error } = state;

  const pageStart = (page - 1) * pageSize + 1;
  const pageEnd = Math.min(page * pageSize, documents.length);

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
            <IconButton
              size="small"
              onClick={() => { }}
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
            <Typography variant="body2" color="text.secondary">
              {pageStart} - {pageEnd} of {documents.length}
            </Typography>

            <IconButton
              size="small"
              onClick={() => { }}
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
            <IconButton
              size="small"
              onClick={() => { }}
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

            <StyledSelect
              value={`${pageSize}`}
              onChange={(e) => {
                console.log("Page size changed:", e.target.value);
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

      <Grid2
        container
        spacing={1}
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 0,
          flex: 1,
          overflow: "hidden",
        }}>
        <Grid2
          size={{
            xs: 6,
            sm: 6,
            md: 5,
            lg: 4,
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            minWidth: 0,
            height: "100%",
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "100%",
              height: "100%",
              borderRadius: 3,
              border: 1,
              borderColor: (theme) => alpha(theme.palette.primary.dark, 0.3),
              overflowY: "auto",
            }}
          >
          </Box>
        </Grid2>
        <Grid2
          size={{
            xs: 6,
            sm: 6,
            md: 7,
            lg: 8,
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: "100%",
            minHeight: 0,
            gap: 1,
            borderRadius: 3,
            overflowY: "hidden",
          }}
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
                    <DocumentRenderer key={index} document={doc} />
                  ))}
              </Box>
            }
          />
        </Grid2>
      </Grid2>
      {/* <Box */}
      {/*   component={"footer"} */}
      {/*   sx={{ */}
      {/*     display: "flex", */}
      {/*     justifyContent: "flex-end", */}
      {/*     alignItems: "center", */}
      {/*     paddingTop: 1, */}
      {/*     borderTop: 0.5, */}
      {/*     borderColor: (theme) => alpha(theme.palette.primary.dark, 0.3), */}
      {/*   }}> */}
      {/**/}
      {/**/}
      {/* </Box> */}
    </Box >
  );
}
