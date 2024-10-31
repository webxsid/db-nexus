// usePopper.tsx
import { ContextMenuContext, IContextMenuContextType } from "@/context";
import { useContext } from "react";

export const useContextMenu = (): IContextMenuContextType => {
  const context = useContext(ContextMenuContext);

  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider");
  }

  return context;
};
