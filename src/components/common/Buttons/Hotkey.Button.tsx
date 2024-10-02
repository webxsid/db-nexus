import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";
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
  useEffect(() => {
    if (!keyBindings) return;

    // Register keybindings using the keybinding manager
    KeybindingManager.registerKeybinding(keyBindings, onClick);

    // Cleanup keybindings on component unmount
    return () => {
      KeybindingManager.unregisterKeybinding(keyBindings, onClick);
    };
  }, [keyBindings, onClick]);

  return (
    <Tooltip title={`${props.tooltip} (${keyBindings[0]})`} arrow>
      <Button
        {...props}
        onClick={onClick}
        endIcon={
          props.showhotkey ? <KeyCombo keyCombo={keyBindings[0]} /> : null
        }
      >
        {children}
      </Button>
    </Tooltip>
  );
};
