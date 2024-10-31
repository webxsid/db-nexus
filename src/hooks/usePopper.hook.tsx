// usePopper.tsx
import { IPopperContextType, PopperContext } from "@/context";
import { useContext } from "react";

export const usePopper = (): IPopperContextType => {
  const context = useContext(PopperContext);

  if (!context) {
    throw new Error("usePopper must be used within a PopperProvider");
  }

  return context;
};
