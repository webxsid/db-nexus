import { KeybindingManager, KeyCombo } from "@/helpers/keybindings";
import { usePopper } from "@/hooks";
import { Box, Button, ButtonProps, Typography } from "@mui/material";
import { FC, MouseEvent, useEffect } from "react";

export interface IHotkeyButtonProps extends ButtonProps {
  keyBindings?: string[]; // Array of key combinations like ['Meta+s', 'Ctrl+Shift+S']
  tooltip?: string;
  onClick: () => void;
  showhotkey: boolean;
  skipBind?: boolean;
  disabled?: boolean;
  hotKeySize?: "smaller" | "small" | "normal" | "large";
}

// Component definition
export const HotkeyButton: FC<IHotkeyButtonProps> = ({
  keyBindings,
  onClick,
  children,
  disabled,
  skipBind,
  hotKeySize = "normal",
  ...props
}) => {
  const { showPopper, hidePopper } = usePopper();
  useEffect(() => {
    if (!keyBindings) return;
    if (skipBind) return;

    if (!disabled) {
      // Register keybindings using the keybinding manager
      KeybindingManager.registerKeybinding(keyBindings, onClick);
    } else {
      KeybindingManager.unregisterKeybinding(keyBindings, onClick);
    }

    // Cleanup keybindings on component unmount
    return () => {
      KeybindingManager.unregisterKeybinding(keyBindings, onClick);
    };
  }, [keyBindings, onClick, disabled, skipBind]);

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>): void => {
    if (props.tooltip) {
      showPopper(e.currentTarget, {
        content: (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="body2">{props.tooltip}</Typography>
            {keyBindings && (
              <Box>
                <KeyCombo keyCombo={keyBindings[0]} size="small" />
              </Box>
            )}
          </Box>
        ),
        placement: "bottom",
      });
    }
  };

  const handleMouseLeave = (): void => {
    hidePopper();
  };

  return (
    <Button
      {...props}
      onClick={onClick}
      endIcon={
        props.showhotkey ? (
          <KeyCombo keyCombo={keyBindings[0]} size={hotKeySize} />
        ) : null
      }
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Button>
  );
};
