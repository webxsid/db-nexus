import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import MongoDatabases from "./pages/Databases/Mongo/Databases";
import MongoDBLayout from "./components/pages/Databases/Mongo/Layout";
import { SupportedDatabases } from "./components/common/types";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/database",
    children: [
      {
        path: SupportedDatabases.MONGO,
        element: <MongoDBLayout />,
        children: [
          {
            path: "databases",
            index: true,
            element: <MongoDatabases />,
          },
        ],
      },
    ],
  },
]);

export default Router;
