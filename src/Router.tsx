/* eslint-disable react/react-in-jsx-scope */
import { createHashRouter } from "react-router-dom";
import { Home, MongoDbPage } from "./pages";
import { ESupportedDatabases } from "@shared";

const Router = createHashRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: `/${ESupportedDatabases.Mongo}/:id`,
      element: <MongoDbPage />
    }
  ],
  {
    basename: "/",
  },
);

export default Router;
