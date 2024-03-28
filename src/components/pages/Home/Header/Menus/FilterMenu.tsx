import React from "react";
import { IFilterState } from "@/local-store/types";
import { filterActions } from "@/local-store/actions";
import {
  Menu,
  ListItemText,
  useTheme,
  Typography,
  Checkbox,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Divider,
  MenuItem,
} from "@mui/material";
import { useSelector } from "react-redux";
import RootState from "@/store/types";
import StyledSelect from "@/components/common/StyledSelect";
import { Close, FilterAltOff } from "@mui/icons-material";

interface Props {
  anchorEl: null | HTMLElement;
  open: boolean;
  filterState: IFilterState;
  filterDispatch: React.Dispatch<IFilterState>;
  handleClose: () => void;
}

const FilterMenu: React.FC<Props> = ({
  anchorEl,
  open,
  filterState,
  filterDispatch,
  handleClose,
}) => {
  const databases = useSelector((state: RootState) => state.database);
  const [types, setTypes] = React.useState<string[]>([]);
  const theme = useTheme();

  const handleReset = () => {
    filterDispatch(filterActions.clearFilter());
    filterDispatch(filterActions.clearSort());
  };

  const handleToggleType = (value: string) => {
    if (filterState.filter.types.includes(value)) {
      filterDispatch(filterActions.removeType(value));
    } else {
      filterDispatch(filterActions.addType(value));
    }
  };

  React.useEffect(() => {
    const allTypes: string[] = [];
    // eslint-disable-next-line
    for (const [key, value] of Object.entries(databases)) {
      allTypes.push(key as string);
    }
    setTypes(allTypes);
  }, [databases]);
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      transformOrigin={{
        horizontal: "right",
        vertical: "top",
      }}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: `${theme.palette.background.default}33`,
            backdropFilter: "blur(10px)",
            borderRadius: 4,
            mt: 1,
            minWidth: 400,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
          py: 1,
          px: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body1">Filter &amp; Sort</Typography>
          <Button
            startIcon={<FilterAltOff />}
            variant="text"
            sx={{
              fontSize: "0.75rem",
            }}
            disabled={
              filterState.filter.types.length === 0 &&
              !filterState.filter.query &&
              !filterState.sort.field &&
              !filterState.sort.order
            }
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
        <Box sx={{ width: "100%" }}>
          <TextField
            value={filterState.filter.query}
            onChange={(e) =>
              filterDispatch(filterActions.addQuery(e.target.value))
            }
            label="Search"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {filterState.filter.query && (
                    <IconButton
                      onClick={() =>
                        filterDispatch(filterActions.removeQuery())
                      }
                    >
                      <Close />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <FormControl
          sx={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <InputLabel id="types">Types</InputLabel>
          <StyledSelect
            labelId="types"
            value={filterState.filter.types}
            // onChange={handleToggleType}
            fullWidth
            multiple
            size="medium"
            label="Types"
          >
            {types.map((type) => (
              <MenuItem
                key={type}
                value={type}
                onClick={() => handleToggleType(type)}
              >
                <Checkbox checked={filterState.filter.types.includes(type)} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <Divider
          sx={{
            width: "100%",
            backgroundColor: `${theme.palette.primary.main}33`,
          }}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <FormControl
            sx={{
              flex: 1,
            }}
          >
            <InputLabel id="sort">Sort By</InputLabel>
            <StyledSelect
              labelId="sort"
              value={filterState.sort.field || ""}
              onChange={(e) =>
                filterDispatch(
                  filterActions.setSort({
                    field: e.target.value as string,
                    order: filterState.sort.order,
                  })
                )
              }
              fullWidth
              size="medium"
              label="Sort By"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="createdAt">Created At</MenuItem>
              <MenuItem value="lastConnectionAt">Last Connection</MenuItem>
            </StyledSelect>
          </FormControl>
          <FormControl
            sx={{
              flex: 1,
            }}
          >
            <InputLabel id="order">Order</InputLabel>
            <StyledSelect
              labelId="order"
              value={filterState.sort.order || ""}
              onChange={(e) =>
                filterDispatch(
                  filterActions.setSort({
                    field: filterState.sort.field,
                    order: e.target.value as string,
                  })
                )
              }
              size="medium"
              fullWidth
              label="Order"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </StyledSelect>
          </FormControl>
        </Box>
      </Box>
    </Menu>
  );
};

export default FilterMenu;
