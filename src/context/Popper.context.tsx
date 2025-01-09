// PopperContext.tsx
import { PopperPlacementType, PopperProps } from "@mui/material";
import React, { createContext, ReactNode, useState } from "react";

export interface IShowPopperOptions {
  content: ReactNode;
  placement?: PopperPlacementType;
  enableClickAway?: true | (() => void);
}

export interface IPopperContextType {
  showPopper: (
    anchorEl: PopperProps["anchorEl"],
    options: IShowPopperOptions,
  ) => void;
  hidePopper: () => void;
  anchorEl: PopperProps["anchorEl"];
  content: ReactNode | null;
  placement?: PopperPlacementType;
  clickAway: () => void;
}

export const PopperContext = createContext<IPopperContextType | undefined>(
  undefined,
);

export const PopperProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState<PopperProps["anchorEl"]>(null);
  const [placement, setPlacement] = useState<PopperPlacementType>("bottom");
  const [content, setContent] = useState<ReactNode | null>(null);
  const showPopper = (
    el: PopperProps["anchorEl"],
    options: IShowPopperOptions,
  ): void => {
    setAnchorEl(el);
    setContent(options.content);
    setPlacement(options.placement || "auto");
  };

  const hidePopper = (): void => {
    setAnchorEl(null);
  };

  return (
    <PopperContext.Provider
      value={{
        showPopper,
        hidePopper,
        anchorEl,
        content,
        placement,
        clickAway: hidePopper,
      }}
    >
      {children}
      {/* PopperComponent will handle the rendering */}
    </PopperContext.Provider>
  );
};
