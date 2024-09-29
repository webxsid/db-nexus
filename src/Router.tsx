/* eslint-disable react/react-in-jsx-scope */
import { createHashRouter } from "react-router-dom";
import Home from "./pages/Home";

const Router = createHashRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    // {
    //   path: SupportedDatabases.MONGO,
    //   element: <MongoDBLayout />,
    //   children: [
    //     {
    //       path: "",
    //       index: true,
    //       element: <MongoDatabases />,
    //     },
    //     {
    //       path: ":dbName/collections",
    //       element: <MongoCollections />,
    //     },
    //     {
    //       path: "documents",
    //       element: <MongoDocuments />,
    //     },
    //   ],
    // },
  ],
  {
    basename: "/",
  },
);

export default Router;
