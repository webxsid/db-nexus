import React from "react";
import {
  Menu,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useTheme,
  Typography,
  Checkbox,
} from "@mui/material";
import { IFilter, IFilterState } from "@/local-store/types";
import { filterActions } from "@/local-store/actions";
import { useSelector } from "react-redux";
import RootState from "@/store/types";

interface Props {
  anchorEl: null | HTMLElement;
  open: boolean;
  selectedTypes: IFilter["types"];
  filterDispatch: React.Dispatch<IFilterState>;
  handleClose: () => void;
}
const TypesMenu: React.FC<Props> = ({
  anchorEl,
  open,
  selectedTypes,
  filterDispatch,
  handleClose,
}) => {
  const databases = useSelector((state: RootState) => state.database);
  const [types, setTypes] = React.useState<string[]>([]);
  const theme = useTheme();

  const handleToggle = (value: string) => {
    if (selectedTypes.includes(value)) {
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
            minWidth: 200,
          },
        },
      }}
    >
      <Typography variant="body1" sx={{ px: 2, pt: 1 }}>
        Types
      </Typography>
      <List>
        {types.map((type) => (
          <ListItemButton
            key={type}
            onClick={() => {
              handleToggle(type);
            }}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={selectedTypes.includes(type)}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  color="primary.main"
                  sx={{
                    textTransform: "capitalize",
                  }}
                >
                  {type}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Menu>
  );
};

export default TypesMenu;
