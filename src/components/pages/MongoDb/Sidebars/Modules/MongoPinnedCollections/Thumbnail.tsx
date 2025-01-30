import { Bookmarks, BookmarksOutlined } from "@mui/icons-material";
import { MongoSidebarModuleThumbnailTemplate } from "../Templates";
import { FC } from "react";

export const MongoPinnedCollectionsThumbnail: FC = () => {
  return (
    <MongoSidebarModuleThumbnailTemplate
      icon={<BookmarksOutlined sx={{ fontSize: "1.5rem" }} />}
      activeIcon={<Bookmarks sx={{ fontSize: "1.5rem" }} />}
      label="Pinned Collections"
      moduleKey="pinned-collections"
      side={"left"}
      keyBinding="Meta+2"
    />
  );
};
