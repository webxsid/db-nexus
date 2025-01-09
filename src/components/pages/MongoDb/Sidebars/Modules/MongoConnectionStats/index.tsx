import { MongoSidebarModuleRegistry } from "../../Registry.ts";
import { MongoConnectionInfoThumbnail } from "./Thumbnail.tsx";
import { MongoConnectionStatsPanel } from "./Panel.tsx";

MongoSidebarModuleRegistry.registerModule(
  "stats",
  <MongoConnectionInfoThumbnail />,
  <MongoConnectionStatsPanel />
);
