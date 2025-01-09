import { Layers } from "@mui/icons-material";
import { MongoSidebarModuleThumbnailTemplate } from "../Templates";
import { FC } from "react";

export const MongoActiveCollectionThumbnail: FC = () => {
  return (
    <MongoSidebarModuleThumbnailTemplate
      icon={<Layers sx={{ fontSize: "1.5rem" }} />}
      label="Active Collections"
      moduleKey="active-collections"
      side={"left"}
      keyBinding="Meta+1"
    />
  );
};
