import { Layers, LayersOutlined } from "@mui/icons-material";
import { MongoSidebarModuleThumbnailTemplate } from "../Templates";
import { FC } from "react";

export const MongoCollectionListThumbnail: FC = () => {
  return (
    <MongoSidebarModuleThumbnailTemplate
      icon={<LayersOutlined sx={{ fontSize: "1.5rem" }} />}
      activeIcon={<Layers sx={{ fontSize: "1.5rem" }} />}
      label="Collection List"
      moduleKey="collection-list"
      side={"left"}
      keyBinding="Meta+1"
    />
  );
};
