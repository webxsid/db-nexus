import { MongoSidebarModuleRegistry } from "../../Registry.ts";
import { MongoActiveCollectionThumbnail } from "./Thumbnail.tsx";
import {
  MongoActiveCollectionListPanel
} from "@/components/pages/MongoDb/Sidebars/Modules/MongoActiveCollections/Panel.tsx";

MongoSidebarModuleRegistry.registerModule(
  "active-collections",
  <MongoActiveCollectionThumbnail />,
  <MongoActiveCollectionListPanel />
);
