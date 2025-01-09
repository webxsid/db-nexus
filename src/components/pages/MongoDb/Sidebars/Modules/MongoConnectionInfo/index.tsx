import { MongoSidebarModuleRegistry } from "../../Registry.ts";
import { MongoConnectionInfoThumbnail } from "./Thumbnail.tsx";
import { MongoConnectionInfoPanel } from "./Panel.tsx";

MongoSidebarModuleRegistry.registerModule(
  "connection-info",
  <MongoConnectionInfoThumbnail />,
  <MongoConnectionInfoPanel />
);
