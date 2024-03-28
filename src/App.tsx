import "./App.css";
import { RouterProvider } from "react-router-dom";
import ThemeWrapper from "./components/wrappers/ThemeWrapper";
import Router from "./Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <ThemeWrapper>
      <ToastContainer
        theme="dark"
        position="bottom-center"
        pauseOnFocusLoss={false}
        hideProgressBar
      />
      <RouterProvider router={Router} />
    </ThemeWrapper>
  );
}

export default App;
