import { MongoSidebarModuleRegistry } from "../../Registry.ts";
import { MongoPinnedCollectionThumbnail } from "./Thumbnail.tsx";
import {
  MongoPinnedCollectionListPanel
} from "@/components/pages/MongoDb/Sidebars/Modules/MongoPinnedCollections/Panel.tsx";

MongoSidebarModuleRegistry.registerModule(
  "pinned-collections",
  <MongoPinnedCollectionThumbnail />,
  <MongoPinnedCollectionListPanel />
);
