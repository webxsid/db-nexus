import { DevTools } from "jotai-devtools";
import "jotai-devtools/styles.css";
import { FC, ReactNode } from "react";

const DevToolsWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <DevTools />
      {children}
    </>
  );
};

export default DevToolsWrapper;
