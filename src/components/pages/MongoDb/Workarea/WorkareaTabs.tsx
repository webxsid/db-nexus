import {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  mongoActiveTabsAtom,
  mongoSelectedTabAtom,
  selectedConnectionAtom,
  TMongoTab, toggleDirtyTabAtom
} from "@/store";
import { Box, darken, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { usePopper } from "@/hooks";
import { Add, Close } from "@mui/icons-material";
import { useDialogManager } from "@/managers";
import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";
import { toast } from "react-toastify";

export const TabItem: FC<{
  tab: TMongoTab;
  onClose: (tabId: string, e?: MouseEvent) => void;
  selectedTabId: string;
  onClick: (tabId: string) => void;
}> = ({ tab, onClose, selectedTabId, onClick }) => {
  const [label, setLabel] = useState<string>("");
  const [_secondaryLabel, setSecondaryLabel] = useState<string | null>(null);
  const connection = useAtomValue(selectedConnectionAtom);

  const { showPopper, hidePopper } = usePopper();

  const onHover = (e: MouseEvent, label: string): void => {
    if (tab.id !== selectedTabId) return;
    showPopper(e.currentTarget, {
      content: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">{label}</Typography>
          <KeyCombo keyCombo={"Meta+W"} />
        </Box>
      ),
    });
  };

  // Set label and secondary label based on tab type
  useEffect(() => {
    switch (tab.type) {
      case "collection":
        setLabel(tab.collection);
        setSecondaryLabel(tab.database);
        break;
      case "database":
        setLabel(tab.database);
        setSecondaryLabel("Database");
        break;
      case "connection":
        setLabel(connection?.name || "MongoDB");
        setSecondaryLabel("Connection");
        break;
      default:
        setLabel("MongoDB");
        break;
    }
  }, [tab, connection?.name]);

  return (
    <Tab
      onClick={() => onClick(tab.id)}
      id={`tab-${tab.id}`}
      aria-controls={`tabpanel-${tab.id}`}
      disableRipple
      sx={{
        textTransform: "none",
        transition: "width 0.2s ease-in-out",
        pl: 2,
        pr: 0.5,
        py: 1,
        fontSize: tab.id === selectedTabId ? "1rem" : "0.9rem",
        minWidth: "unset",
        fontWeight: tab.id === selectedTabId ? "bold" : "normal",
        position: "relative", // Important for overlaying actions
        "& .tab-action": {
          opacity: tab.id === selectedTabId ? 1 : 0,
        },

        "&:hover": {
          "& .tab-action": {
            opacity: 1,
          },
        },
        "&.MuiTab-root": {
          minHeight: 40,
          opacity: 1,
        },
      }}
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 2,
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Tab Label */}
          <Typography
            variant="body2"
            noWrap
            sx={{
              color: (theme) =>
                tab.id === selectedTabId
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              transition: "all 0.2s ease-in-out",
              textOverflow: "ellipsis",
              overflow: "hidden",
              fontWeight: "bold",
            }}
          >
            {label}
          </Typography>

          {/* Action Buttons */}
          <Box
            className="tab-action"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              top: 2,
              right: 2,
              transition: "opacity 0.2s ease-in-out",
              backgroundColor: "transparent",
              "&:hover": {
                opacity: 1, // Actions appear on hover
              },
            }}
          >
            {/* Close Button */}
            <IconButton
              size="small"
              onClick={(e: MouseEvent) => onClose(tab.id, e)}
              onMouseEnter={(e) => onHover(e, "Close tab")}
              color="error"
              onMouseLeave={hidePopper}
              sx={{
                padding: 0.5,
                borderRadius: 1,
                backgroundColor: (theme) =>
                  darken(theme.palette.background.paper, 0.3),
                "&:hover": {
                  backgroundColor: (theme) =>
                    darken(theme.palette.background.paper, 0.1),
                },
              }}
            >
              <Close sx={{ fontSize: "0.9rem" }} />
            </IconButton>
          </Box>
        </Box>
      }
      value={tab.id}
    />
  );
};

export const WorkareaTabs: FC = () => {
  const [activeTabs, setActiveTabs] = useAtom(mongoActiveTabsAtom);
  const [selectedTabId, setSelectedTabId] = useAtom(mongoSelectedTabAtom);
  const _toggleDirtyTab = useSetAtom(toggleDirtyTabAtom);


  const { showPopper, hidePopper } = usePopper();

  const { openDialog } = useDialogManager();

  const [selectedIndex, selectedTab] = useMemo<[number, TMongoTab] | [false, false]>(() => {
    const index = activeTabs.findIndex((tab) => tab.id === selectedTabId);
    return index !== -1 ? [index, activeTabs[index]] : [false, false];
  }, [activeTabs, selectedTabId]);

  const handleSelectTab = (tabId: string): void => {
    if(selectedTabId === tabId) return;

    if(selectedTab && selectedTab.isDirty) {
      toast.error("Please save or discard changes before switching tabs");
      // TODO: Show dialog to save or discard changes
      return;
    }

    setSelectedTabId(tabId);
  };

  const handleCloseTab = useCallback(
    (tabId: string, e?: MouseEvent): void => {
      e?.stopPropagation();
      const tabIndex = activeTabs.findIndex((tab) => tab.id === tabId);
      if (tabIndex === -1) return; // Tab not found, exit early

      const newTabs = [...activeTabs];
      newTabs.splice(tabIndex, 1);

      console.log("New tabs", newTabs);
      setActiveTabs(newTabs);

      // Fix: Select adjacent tab if the closed tab was active
      if (selectedTabId === tabId) {
        console.log("Selected tab is closed");
        const newSelectedTab =
          newTabs[tabIndex] || newTabs[tabIndex - 1] || null;
        console.log("New selected tab", newSelectedTab);
        setSelectedTabId(newSelectedTab?.id ?? "");
      }

      hidePopper();
    },
    [activeTabs, selectedTabId, setActiveTabs, setSelectedTabId, hidePopper],
  );

  const closeTabWithKeybinding = useCallback(
    function closeTabWithKeybinding() {
      console.log("Close tab with keybinding", selectedIndex);
      if (selectedIndex === false) return;
      handleCloseTab(activeTabs[selectedIndex].id);
    },
    [selectedIndex, activeTabs, handleCloseTab],
  );

  const onAddTabHover = (e: MouseEvent): void => {
    showPopper(e.currentTarget, {
      content: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">New Tab</Typography>
          <KeyCombo keyCombo={"Meta+T"} />
        </Box>
      ),
      placement: "bottom-end",
    });
  };

  const onAddTab = (): void => {
    openDialog("mongoCommandCentre");
  };

  useEffect(() => {
    KeybindingManager.registerKeybinding(
      ["Meta+w"],
      closeTabWithKeybinding,
    );
    return () => {
      KeybindingManager.unregisterKeybinding(
        ["Meta+w"],
        closeTabWithKeybinding,
      );
    };
  }, [closeTabWithKeybinding]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Tabs
        TabIndicatorProps={{
          sx: {
            backgroundColor: (theme) => theme.palette.primary.main,
            transition: "all 0.2s ease-in-out",
          },
        }}
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 40,
          pr: 1,
          flexGrow: 1,
        }}
        value={selectedIndex}
      >
        {activeTabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            onClose={handleCloseTab}
            selectedTabId={selectedTabId}
            onClick={handleSelectTab}
          />
        ))}
      </Tabs>
      <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
        <IconButton
          size="small"
          onClick={onAddTab}
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
          onMouseEnter={onAddTabHover}
          onMouseLeave={hidePopper}
        >
          <Add sx={{ fontSize: "0.9rem" }} />
        </IconButton>
      </Box>
    </Box>
  );
};
