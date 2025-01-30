import { MongoSidebarModuleRegistry } from "../../Registry.ts";
import { MongoPinnedCollectionsThumbnail } from "./Thumbnail.tsx";
import {
  MongoPinnedCollectionsPanel
} from "@/components/pages/MongoDb/Sidebars/Modules/MongoPinnedCollections/Panel.tsx";

MongoSidebarModuleRegistry.registerModule(
  "pinned-collections",
  <MongoPinnedCollectionsThumbnail />,
  <MongoPinnedCollectionsPanel />
);
