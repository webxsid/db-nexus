import { FC } from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { WorkareaTabs } from "./WorkareaTabs.tsx";
import { mongoActiveTabsAtom } from "@/store";
import { useAtomValue } from "jotai";
import { KeyCombo } from "@/helpers/keybindings";
import { useDialogManager } from "@/managers";
import { MongoTabPanels } from "@/components/pages/MongoDb/Workarea/WorkareaTabPanels";

export const MongoDbWorkarea: FC = () => {
  const activeTabs = useAtomValue(mongoActiveTabsAtom);

  const { openDialog } = useDialogManager();

  if (activeTabs.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: "text.secondary",
          fontSize: "1.5rem",
        }}
      >
        <List dense disablePadding>
          <ListItem>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Typography variant="body1">
                    Open a new tab to get started
                  </Typography>
                  <KeyCombo keyCombo={"Meta+T"} size="small" />
                </Box>
              }
            />
          </ListItem>
        </List>
      </Box>
    );
  }
  return (
    <Box
      component={"main"}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 40,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <WorkareaTabs />
      </Box>
      <MongoTabPanels />
    </Box>
  );
};
