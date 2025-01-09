import { Bookmark } from "@mui/icons-material";
import { MongoSidebarModuleThumbnailTemplate } from "../Templates";
import { FC } from "react";

export const MongoPinnedCollectionThumbnail: FC = () => {
  return (
    <MongoSidebarModuleThumbnailTemplate
      icon={<Bookmark sx={{ fontSize: "1.5rem" }} />}
      label="Pinned Collections"
      moduleKey="pinned-collections"
      side={"left"}
      keyBinding="Meta+2"
    />
  );
};
