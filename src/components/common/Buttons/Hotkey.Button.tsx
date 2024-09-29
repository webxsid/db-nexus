import { useKeybindingManager } from "@/managers";
import { Button, ButtonProps, Tooltip } from "@mui/material";
import React, { useEffect } from "react";

export interface IHotkeyButtonProps extends ButtonProps {
  keyBindings?: string[]; // Array of key combinations like ['Meta+s', 'Ctrl+Shift+S']
  tooltip?: string;
  onClick: () => void;
  showhotkey: boolean;
}

// Component definition
export const HotkeyButton: React.FC<IHotkeyButtonProps> = ({
  keyBindings,
  onClick,
  children,
  ...props
}) => {
  const { registerKeybinding, unregisterKeybinding, getKeyComboIcons } =
    useKeybindingManager();
  useEffect(() => {
    if (!keyBindings) return;

    // Register keybindings using the keybinding manager
    registerKeybinding(keyBindings, onClick);

    // Cleanup keybindings on component unmount
    return () => {
      unregisterKeybinding(keyBindings, onClick);
    };
  }, [keyBindings, onClick, registerKeybinding, unregisterKeybinding]);

  return (
    <Tooltip title={`${props.tooltip} (${keyBindings[0]})`} arrow>
      <Button
        {...props}
        onClick={onClick}
        endIcon={
          props.showhotkey ? getKeyComboIcons(keyBindings[0], "small") : null
        }
      >
        {children}
      </Button>
    </Tooltip>
  );
};
