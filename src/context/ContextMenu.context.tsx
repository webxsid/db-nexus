// PopperContext.tsx
import { MenuProps } from "@mui/material";
import React, { createContext, ReactNode, useState } from "react";

export interface IShowContextMenuOptions {
  content: ReactNode;
  anchorOrigin?: MenuProps["anchorOrigin"];
  transformOrigin?: MenuProps["transformOrigin"];
  onClose?: () => void;
}

export interface IContextMenuContextType {
  showContextMenu: (
    anchor: { mouseX: number; mouseY: number },
    options: IShowContextMenuOptions,
  ) => void;
  hideContextMenu: () => void;
  anchor: { mouseX: number; mouseY: number };
  content: ReactNode | null;
  transformOrigin?: MenuProps["transformOrigin"];
  anchorOrigin?: MenuProps["anchorOrigin"];
  onClose: () => void;
}

export const ContextMenuContext = createContext<
  IContextMenuContextType | undefined
>(undefined);

export const ContextMenuProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [anchor, setAnchor] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [transformOrigin, setTransformOrigin] = useState<
    MenuProps["transformOrigin"]
  >({
    vertical: "top",
    horizontal: "left",
  });
  const [anchorOrigin, setAnchorOrigin] = useState<MenuProps["anchorOrigin"]>({
    vertical: "top",
    horizontal: "left",
  });
  const [content, setContent] = useState<ReactNode | null>(null);
  const [onClose, setOnClose] = useState<() => void | null>(null);

  const handleClose = (): void => {
    setAnchor(null);
    if (onClose) {
      console.log("onClose");
      onClose();
    }
  };

  const showContextMenu = (
    anchor: { mouseX: number; mouseY: number },
    options: IShowContextMenuOptions,
  ): void => {
    setAnchor(anchor);
    setContent(options.content);
    setTransformOrigin(
      options.transformOrigin || { vertical: "top", horizontal: "left" },
    );
    setAnchorOrigin(
      options.anchorOrigin || { vertical: "top", horizontal: "left" },
    );

    if (options.onClose) {
      setOnClose(options.onClose);
    }
  };

  const hideContextMenu = (): void => {
    setAnchor(null);
  };

  return (
    <ContextMenuContext.Provider
      value={{
        showContextMenu,
        hideContextMenu,
        anchor,
        content,
        transformOrigin,
        anchorOrigin,
        onClose: handleClose,
      }}
    >
      {children}
      {/* PopperComponent will handle the rendering */}
    </ContextMenuContext.Provider>
  );
};
