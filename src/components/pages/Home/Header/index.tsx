import React from "react";
import { Box, Typography, IconButton, useTheme, Chip } from "@mui/material";
import {
  Explore,
  Settings,
  FilterAlt,
  Search,
  Storage,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { IFilterState } from "@/local-store/types";
import { filterActions } from "@/local-store/actions";
import SortMenu from "./Menus/SortMenu";
import TypesMenu from "./Menus/TypesMenu";
import FilterMenu from "./Menus/FilterMenu";

const ChipIcon: React.FC<{ label: React.ReactNode }> = ({ label }) => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        color: "secondary.contrastText",
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ml: 1,
      }}
    >
      {label}
    </Box>
  );
};

interface Props {
  filterState: IFilterState;
  filterDispatch: React.Dispatch<IFilterState>;
}
const Header: React.FC<Props> = ({ filterState, filterDispatch }) => {
  const [filterActive, setFilterActive] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menus, setMenus] = React.useState<{
    sort: boolean;
    type: boolean;
    filter: boolean;
  }>({
    sort: false,
    type: false,
    filter: false,
  });
  const theme = useTheme();

  React.useEffect(() => {
    if (
      filterState.filter.query ||
      filterState.filter.types.length ||
      filterState.sort.field ||
      filterState.sort.order
    ) {
      setFilterActive(true);
    } else {
      setFilterActive(false);
    }
  }, [filterState]);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: `${theme.palette.primary.main}cc`,
        backdropFilter: "blur(10px)",
        border: `1px solid ${theme.palette.primary.main}`,
        boxShadow: `0px 0px 10px 0px ${theme.palette.primary.main}`,
        overflowY: "auto",
        display: "flex",
        justifyContent: "space-between",
        borderRadius: 4,
        gap: 1,
        p: 1,
      }}
    >
      <SortMenu
        sort={filterState.sort}
        filterDispatch={filterDispatch}
        anchorEl={anchorEl}
        open={menus.sort}
        handleClose={() => setMenus({ ...menus, sort: false })}
      />
      <TypesMenu
        selectedTypes={filterState.filter.types}
        filterDispatch={filterDispatch}
        anchorEl={anchorEl}
        open={menus.type}
        handleClose={() => setMenus({ ...menus, type: false })}
      />
      <FilterMenu
        filterState={filterState}
        filterDispatch={filterDispatch}
        anchorEl={anchorEl}
        open={menus.filter}
        handleClose={() => setMenus({ ...menus, filter: false })}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "primary.contrastText",
        }}
      >
        <Explore
          sx={{
            color: "inherit",
          }}
        />
        <Typography
          variant="h5"
          sx={{
            color: "inherit",
          }}
        >
          DB Compass
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "primary.contrastText",
        }}
      >
        {filterState.filter.query && (
          <Chip
            icon={
              <ChipIcon
                label={
                  <Search
                    sx={{
                      fontSize: "1rem",
                    }}
                  />
                }
              />
            }
            label={filterState.filter.query}
            onDelete={() => filterDispatch(filterActions.removeQuery())}
          />
        )}
        {filterState.filter.types.length > 0 && (
          <Chip
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setMenus({ ...menus, type: true });
            }}
            icon={
              filterState.filter.types.length > 1 ? (
                <ChipIcon label={filterState.filter.types.length} />
              ) : (
                <ChipIcon
                  label={
                    <Storage
                      sx={{
                        fontSize: "1rem",
                      }}
                    />
                  }
                />
              )
            }
            label={
              filterState.filter.types.length > 1
                ? `types`
                : filterState.filter.types[0]
            }
            onDelete={() => filterDispatch(filterActions.clearType())}
          />
        )}
        {filterState.sort.field && (
          <Chip
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setMenus({ ...menus, sort: true });
            }}
            icon={
              <ChipIcon
                label={
                  filterState.sort.order === "asc" ? (
                    <ExpandLess
                      sx={{
                        fontSize: "1rem",
                      }}
                    />
                  ) : (
                    <ExpandMore
                      sx={{
                        fontSize: "1rem",
                      }}
                    />
                  )
                }
              />
            }
            label={
              filterState.sort.field === "name"
                ? "Name"
                : filterState.sort.field === "createdAt"
                ? "Created At"
                : "Recently Connected"
            }
            onDelete={() => filterDispatch(filterActions.clearSort())}
          ></Chip>
        )}
        <IconButton
          color="inherit"
          sx={{
            backgroundColor: filterActive ? "primary.dark" : "inherit",
          }}
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setMenus({ ...menus, filter: true });
          }}
        >
          <FilterAlt />
        </IconButton>
        <IconButton color="inherit">
          <Settings />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;
