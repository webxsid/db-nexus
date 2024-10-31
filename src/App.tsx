import { ReactNode } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import {
  ConfirmDialog,
  StyledContextMenu,
  StyledPopper,
} from "./components/common";
import { DevToolsWrapper, ThemeWrapper } from "./components/wrappers";
import { ContextMenuProvider, PopperProvider } from "./context";
import Router from "./Router";
function App(): ReactNode {
  return (
    <DevToolsWrapper>
      <ThemeWrapper>
        <ContextMenuProvider>
          <PopperProvider>
            <ToastContainer
              theme="dark"
              position="bottom-center"
              pauseOnFocusLoss={false}
              hideProgressBar
            />
            <StyledPopper />
            <StyledContextMenu />
            <ConfirmDialog />
            <RouterProvider router={Router} />
          </PopperProvider>
        </ContextMenuProvider>
      </ThemeWrapper>
    </DevToolsWrapper>
  );
}

export default App;
