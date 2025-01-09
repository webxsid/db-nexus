import {
  FC,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useAtom } from "jotai";
import {
  MongoLeftSidebarModuleActiveAtom,
  MongoRightSidebarModuleActiveAtom,
  TMongoSidebarModule,
} from "@/store";
import { Box, Typography, useTheme } from "@mui/material";
import { usePopper } from "@/hooks";
import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";

export type TMongoSideBarKeyBinding =
  | "Meta+0"
  | "Meta+1"
  | "Meta+2"
  | "Meta+3"
  | "Meta+4"
  | "Meta+Shift+0"
  | "Meta+Shift+1"
  | "Meta+Shift+2"
  | "Meta+Shift+3";

export interface IMongoSidebarModuleThumbnailTemplateProps {
  icon: ReactNode; // To accept any icon component (e.g., ViewList)
  label: string; // Label to display in the tooltip
  moduleKey: TMongoSidebarModule; // Unique module identifier (e.g., "collection-list")
  color?: string; // Optional color (can be from the connection object)
  onClick?: () => void; // Custom click handler if needed
  keyBinding?: TMongoSideBarKeyBinding; // Keybinding for this module
  side: "left" | "right";
}

export const MongoSidebarModuleThumbnailTemplate: FC<
  IMongoSidebarModuleThumbnailTemplateProps
> = ({
  icon,
  label,
  moduleKey,
  color: _color,
  onClick: _onClick,
  side,
  keyBinding,
}) => {
  const [leftActiveModule, setLeftActiveModule] = useAtom(
    MongoLeftSidebarModuleActiveAtom,
  );
  const [rightActiveModule, setRightActiveModule] = useAtom(
    MongoRightSidebarModuleActiveAtom,
  );

  const { showPopper, hidePopper } = usePopper();

  const theme = useTheme();

  // Determine if this module is active
  const isActive = useMemo(
    () =>
      side === "left"
        ? leftActiveModule === moduleKey
        : rightActiveModule === moduleKey,
    [leftActiveModule, rightActiveModule, moduleKey, side],
  );

  const currentColor = isActive
    ? theme.palette.primary.main
    : theme.palette.text.primary;

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    showPopper(e.currentTarget, {
      content: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">{label}</Typography>
          {keyBinding && <KeyCombo keyCombo={keyBinding} size="small" />}
        </Box>
      ),
      placement: "auto",
    });
  };

  const handleModuleChange = useCallback(
    function onModuleChange() {
      if (side === "left") {
        setLeftActiveModule((prev) => (prev === moduleKey ? null : moduleKey));
      } else {
        setRightActiveModule((prev) => (prev === moduleKey ? null : moduleKey));
      }
      if (_onClick) _onClick();
    },
    [side, moduleKey, _onClick, setLeftActiveModule, setRightActiveModule],
  );

  useEffect(() => {
    if (!keyBinding) return;
    KeybindingManager.registerKeybinding([keyBinding], handleModuleChange);

    return () => {
      KeybindingManager.unregisterKeybinding([keyBinding], handleModuleChange);
    };
  }, [keyBinding, handleModuleChange]);

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={hidePopper}
      onClick={handleModuleChange}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: currentColor,
        opacity: isActive ? 1 : 0.5,
        cursor: "pointer",
        flexGrow: 1,
      }}
    >
      {icon}
    </Box>
  );
};
