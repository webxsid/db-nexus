import { useKeybindingManager } from "@/managers";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

export interface IConnectionConfigTabsProps {
  selectedTab: number;
  setSelectedTab: (newValue: number) => void;
}
export const ConnectionConfigTabs: FC<IConnectionConfigTabsProps> = ({
  selectedTab,
  setSelectedTab,
}): ReactNode => {
  const { getKeyComboIcons } = useKeybindingManager();

  return (
    <Tabs
      value={selectedTab}
      onChange={(_, newValue) => setSelectedTab(newValue)}
      variant="standard"
      sx={{
        width: "100%",
        "& .MuiTabs-fixed": {
          px: 2,

          "& .MuiTabs-flexContainer": {
            borderBottom: "1px solid",
            borderColor: "divider",
          },
        },
        "& .MuiTabs-indicator": {
          backgroundColor: "primary.main",
          height: "60%",
          transform: "translateY(-35%)",
          borderRadius: 2,
          color: "primary.contrastText",
        },
        "& .MuiTab-root": {
          textTransform: "none",
          minWidth: "unset",
          padding: "6px 12px",
          mr: 2,
          color: "text.secondary",
          "&.Mui-selected": {
            zIndex: 1,
            color: "primary.contrastText",
          },

          "& p": {
            color: "inherit",
            fontWeight: "bold",
            transition: "unset",
          },
        },
      }}
    >
      <Tab
        label={
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            General {getKeyComboIcons("Meta+1", "smaller")}
          </Typography>
        }
      />
      <Tab
        label={
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            Auth {getKeyComboIcons("Meta+2", "smaller")}
          </Typography>
        }
      />
      <Tab
        label={
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            TLS {getKeyComboIcons("Meta+3", "smaller")}
          </Typography>
        }
      />
      <Tab
        label={
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            Proxy {getKeyComboIcons("Meta+4", "smaller")}
          </Typography>
        }
      />
      <Tab
        label={
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            Advanced {getKeyComboIcons("Meta+5", "smaller")}
          </Typography>
        }
      />
    </Tabs>
  );
};

export interface ITabPanelProps {
  value: number;
  index: number;
  children: ReactNode;
}
export const TabPanel: FC<ITabPanelProps> = ({ value, index, children }) => {
  return (
    <Box
      hidden={value !== index}
      sx={{
        width: "100%",
        px: 3,
      }}
    >
      {value === index && children}
    </Box>
  );
};
