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
import { alpha, styled } from "@mui/material";

const StyledToastContainer = styled(ToastContainer)(({ theme }) => ({
  "& .Toastify__toast": {
    background: alpha(theme.palette.primary.dark, 0.6),
    backdropFilter: "blur(10px)",
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[3],
    borderColor: alpha(theme.palette.primary.main, 0.9),
    borderRadius: 32,
    fontFamily: "Roboto, sans-serif",
    fontSize: 16,
    fontWeight: 500,
  },
  "& .Toastify__close-button": {
    color: theme.palette.text.primary,
    opacity: 0.7,
    alignSelf: "center",
  }
}));
function App(): ReactNode {
  return (
    <DevToolsWrapper>
      <ThemeWrapper>
        <ContextMenuProvider>
          <PopperProvider>
            <StyledToastContainer
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
