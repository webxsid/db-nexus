import { ReactNode } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { DevToolsWrapper, ThemeWrapper } from "./components/wrappers";
import Router from "./Router";
function App(): ReactNode {
  return (
    <DevToolsWrapper>
      <ThemeWrapper>
        <ToastContainer
          theme="dark"
          position="bottom-center"
          pauseOnFocusLoss={false}
          hideProgressBar
        />
        <RouterProvider router={Router} />
      </ThemeWrapper>
    </DevToolsWrapper>
  );
}

export default App;
