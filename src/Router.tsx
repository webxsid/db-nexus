/* eslint-disable react/react-in-jsx-scope */
import { createHashRouter } from "react-router-dom";
import { SupportedDatabases } from "./components/common/types";
import MongoDBLayout from "./components/pages/Databases/Mongo/Layout";
import MongoCollections from "./pages/Databases/Mongo/Collections";
import MongoDatabases from "./pages/Databases/Mongo/Databases";
import MongoDocuments from "./pages/Databases/Mongo/Documents";
import Home from "./pages/Home";

const Router = createHashRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: SupportedDatabases.MONGO,
      element: <MongoDBLayout />,
      children: [
        {
          path: "",
          index: true,
          element: <MongoDatabases />,
        },
        {
          path: ":dbName/collections",
          element: <MongoCollections />,
        },
        {
          path: "documents",
          element: <MongoDocuments />,
        },
      ],
    },
  ],
  {
    basename: "/",
  },
);

export default Router;
