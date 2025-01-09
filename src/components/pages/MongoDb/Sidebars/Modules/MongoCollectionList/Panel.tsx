import { FC, useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { mongoCollectionListAtom, mongoDatabaseListAtom } from "@/store";
import {
  Box,
  Collapse,
  darken,
  lighten,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Render from "@/components/common/Render.tsx";
import { ChevronRight, Circle } from "@mui/icons-material";
import { HotkeyButton, TransparentTextField } from "@/components/common";

interface IFilteredCollectionItem {
  id: string;
  label: string;
  sizeOnDisk?: number;
  children: Array<{ id: string; label: string }>;
}

export const MongoCollectionListPanel: FC = () => {
  const { databases } = useAtomValue(mongoDatabaseListAtom);
  const collections = useAtomValue(mongoCollectionListAtom);

  const [collectionSearch, setCollectionSearch] = useState<string>("");
  const [filteredCollections, setFilteredCollections] = useState<
    IFilteredCollectionItem[]
  >([]);

  const [expandedDbs, setExpandedDbs] = useState<string[]>([]);

  const theme = useTheme();

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

    return colorInRGB.replace("rgb", "rgba").replace(")", ", 0.1)");
  };

  useEffect(() => {
    const filtered =
      collectionSearch.length > 0
        ? collections.filter((c) => c.name.includes(collectionSearch))
        : collections;
    const groups: IFilteredCollectionItem[] = Object.entries(databases).map(
      ([dbName, dbStats]) => {
        const dbCollections = filtered.filter((c) => c.database === dbName);
        return {
          id: dbName,
          label: dbName,
          sizeOnDisk: dbStats.sizeOnDisk,
          children: dbCollections.map((c) => ({ id: c.name, label: c.name })),
        };
      },
    );

    console.log(groups);

    setFilteredCollections(groups);
  }, [collectionSearch, collections, databases]);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Render
        if={filteredCollections.length > 0}
        then={
          <>
            <TransparentTextField
              placeholder={"Search collections.."}
              variant="outlined"
              value={collectionSearch}
              onChange={(e) => setCollectionSearch(e.target.value)}
              sx={{
                color: "text.primary",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            />
            <List
              dense
              sx={{
                px: 1,
              }}
            >
              {filteredCollections.map((db) => (
                <Box
                  key={db.id}
                  sx={{
                    backgroundColor: expandedDbs.includes(db.id)
                      ? `${getActiveColor(db.id)}`
                      : "transparent",
                    borderRadius: 2,
                    mb: 0.5,
                    transition: "padding 0.3s",
                    p: expandedDbs.includes(db.id) ? 0.5 : 0,
                  }}
                >
                  <ListItemButton
                    dense
                    disableGutters
                    selected={expandedDbs.includes(db.id)}
                    onClick={(_e) => handleExpandDb(db.id)}
                    sx={{
                      borderRadius: 2,
                      "&.Mui-selected": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {db.children.length > 0 ? (
                        <ChevronRight
                          fontSize={"small"}
                          sx={{
                            transition: "transform 0.3s",
                            transform: expandedDbs.includes(db.id)
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      ) : (
                        <Circle
                          sx={{
                            fontSize: "0.5rem",
                          }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={db.label}
                      primaryTypographyProps={{
                        variant: "body2",
                        noWrap: true,
                        color: "text.primary",
                        fontSize: "0.9rem",
                      }}
                    />
                  </ListItemButton>
                  <Collapse in={expandedDbs.includes(db.id)} unmountOnExit>
                    <List dense disablePadding>
                      <Render
                        if={db.children.length > 0}
                        then={
                          <>
                            {db.children.map((c) => (
                              <ListItemButton
                                key={c.id}
                                dense
                                disableGutters
                                sx={{
                                  borderRadius: 2,
                                  pl: 1.5,
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Circle
                                    sx={{
                                      fontSize: "0.5rem",
                                    }}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: "text.primary",
                                      }}
                                    >
                                      {c.label}
                                    </Typography>
                                  }
                                />
                              </ListItemButton>
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
          </>
        }
        else={
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body2" color="textSecondary">
              No database / collections found
            </Typography>

            <HotkeyButton
              onClick={() => {}}
              keyBindings={["Meta+n"]}
              skipBind={true}
              hotKeySize="smaller"
              variant={"outlined"}
              size={"small"}
              tooltip={"Create a new database"}
            >
              Create Database
            </HotkeyButton>
          </Box>
        }
      />
    </Box>
  );
};
