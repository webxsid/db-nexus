import { HotkeyButton } from "@/components/common/Buttons";
import Logo from "@/components/common/Logo";
import { WindowIPCEvents } from "@/ipc-events";
import { useDialogManager } from "@/managers";
import { Add, Settings } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useCallback, useEffect } from "react";

const Header: React.FC = () => {
  const [isMac, setIsMac] = React.useState(false);
  const { openDialog } = useDialogManager();
  const theme = useTheme();
  const getIsMac = useCallback(async () => {
    const { ok } = await WindowIPCEvents.isMac();
    setIsMac(ok === 1);
  }, []);

  useEffect(() => {
    getIsMac();
  }, [getIsMac]);
  return (
    <Box
      className="draggable"
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "background.default",
        // borderBottom: "1px solid",
        borderColor: "divider",
        overflowY: "auto",
        display: "flex",
        justifyContent: "space-between",
        gap: 1,
        pr: 3,
        py: 2,
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {isMac ? <Box sx={{ height: "100%", width: 75 }} /> : null}
        <Logo />
        <Typography
          variant="h6"
          component={"h1"}
          align="left"
          color={"text.primary"}
        >
          Saved Connections
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "stretch" }}>
        <HotkeyButton
          variant="outlined"
          sx={{
            backgroundColor: `rgba(255, 255, 255, 0.1)`,
            borderColor: `${theme.palette.primary.main}`,
            borderRadius: 2,
          }}
          keyBindings={["Meta+n"]}
          skipBind={"true"}
          hotKeySize="small"
          size="small"
          startIcon={<Add />}
          tooltip="Add a new connection"
          onClick={() => {
            openDialog("selectDbProvider");
          }}
        >
          Connection
        </HotkeyButton>
        {/* <ThemeToggleButton /> */}
        <Button
          disableElevation
          variant="text"
          sx={{
            p: 0,
            aspectRatio: 1,
            minWidth: 42,
            borderRadius: 2,
          }}
          color="primary"
          onClick={() => {}}
        >
          <Settings />
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
