import React from "react";
import {
  Menu,
  MenuItem,
  Box,
  useTheme,
  FormControl,
  InputLabel,
} from "@mui/material";
import { IFilterState, ISort } from "@/local-store/types";
import { filterActions } from "@/local-store/actions";
import StyledSelect from "@/components/common/StyledSelect";

interface Props {
  anchorEl: null | HTMLElement;
  open: boolean;
  sort: ISort;
  filterDispatch: React.Dispatch<IFilterState>;
  handleClose: () => void;
}
const SortMenu: React.FC<Props> = ({
  anchorEl,
  open,
  sort,
  filterDispatch,
  handleClose,
}) => {
  const theme = useTheme();

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
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
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
            value={sort.field || ""}
            onChange={(e) =>
              filterDispatch(
                filterActions.setSort({
                  field: e.target.value as string,
                  order: sort.order,
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
            value={sort.order || ""}
            onChange={(e) =>
              filterDispatch(
                filterActions.setSort({
                  field: sort.field,
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
    </Menu>
  );
};

export default SortMenu;
