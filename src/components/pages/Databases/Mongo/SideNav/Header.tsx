import React from "react";
import {
  Box,
  IconButton,
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Typography,
  useTheme,
  Grid,
} from "@mui/material";
import {
  CopyAllOutlined,
  LinkOff,
  MoreVert as MenuIcon,
  Settings,
} from "@mui/icons-material";
import MongoDBContext, {
  MongoDBContextProps,
} from "@/context/Databases/MongoContext";
import invert from "invert-color";
import { toast } from "react-toastify";
import StyledMenu from "@/components/common/StyledMenu";
import { disconnect } from "@/utils/database";
import { useNavigate } from "react-router";
import { SupportedDatabases } from "@/components/common/types";

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { metaData } = React.useContext<MongoDBContextProps>(MongoDBContext);
  const theme = useTheme();
  const navigate = useNavigate();

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const copyURI = () => {
    window.navigator.clipboard.writeText(metaData?.uri || "");
    toast.success("URI copied to clipboard");
  };

  const handleDisconnect = async () => {
    await disconnect(SupportedDatabases.MONGO)();
    navigate("/");
  };
  return (
    <Grid
      container
      sx={{
        backgroundColor: metaData?.color || theme.palette.primary.main,
        borderRadius: 4,
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: invert(metaData?.color || theme.palette.primary.main, true),
      }}
    >
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List
          sx={{
            py: 0,
            "& .MuiListItemButton-root": {
              px: 5,
            },
          }}
        >
          <ListItemButton onClick={copyURI}>
            <ListItemIcon>
              <CopyAllOutlined />
            </ListItemIcon>
            <ListItemText primary="Copy URI" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
          <ListItemButton
            sx={{
              color: "error.main",
              "& svg": {
                color: "error.main",
              },
              "&:hover": {
                backgroundColor: `${theme.palette.error.main}44`,
                "& svg": {
                  color: theme.palette.error.main,
                },
              },
            }}
            onClick={handleDisconnect}
          >
            <ListItemIcon>
              <LinkOff />
            </ListItemIcon>
            <ListItemText primary="Disconnect" />
          </ListItemButton>
        </List>
      </StyledMenu>
      <Grid
        item
        xs={10}
        sx={{ display: "flex", flexDirection: "column", flex: 2 }}
      >
        {metaData?.name ? (
          <>
            <Typography variant="h5" color="inherit">
              {metaData?.name}
            </Typography>
            <Typography variant="caption" color="inherit" sx={{ mt: 0 }} noWrap>
              {metaData?.uri}
            </Typography>
          </>
        ) : (
          <Typography variant="h6" noWrap color="inherit">
            {metaData?.uri}
          </Typography>
        )}
      </Grid>
      <Grid item xs={2} sx={{ display: "flex", gap: 2, flex: 1 }}>
        <IconButton color="inherit" onClick={openMenu}>
          <MenuIcon color="inherit" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default Header;
