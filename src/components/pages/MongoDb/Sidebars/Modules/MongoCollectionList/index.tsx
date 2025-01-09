import { MongoSidebarModuleRegistry } from "../../Registry.ts";
import { MongoCollectionListThumbnail } from "./Thumbnail.tsx";
import { MongoCollectionListPanel } from "./Panel.tsx";

MongoSidebarModuleRegistry.registerModule(
  "collection-list",
  <MongoCollectionListThumbnail />,
  <MongoCollectionListPanel />,
);
