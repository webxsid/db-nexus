import { ListItemButton, styled, alpha, ListItemIcon } from "@mui/material";

const ListButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 8,
  color: theme.palette.text.primary,
  "&.Mui-selected": {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.text.secondary,
  },
}));

const ListIcon = styled(ListItemIcon)(() => ({
  backgroundColor: "secondary.light",
  color: "secondary.contrastText",
  aspectRatio: 1,
  borderRadius: 2,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  p: 1,
}));


export const CC = {
  ListButton,
  ListIcon,
}