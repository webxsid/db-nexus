import { ViewList } from "@mui/icons-material";
import { MongoSidebarModuleThumbnailTemplate } from "../Templates";
import { FC } from "react";

export const MongoCollectionListThumbnail: FC = () => {
  return (
    <MongoSidebarModuleThumbnailTemplate
      icon={<ViewList sx={{ fontSize: "1.5rem" }} />}
      label="Collection List"
      moduleKey="collection-list"
      side={"left"}
      keyBinding="Meta+0"
    />
  );
};
