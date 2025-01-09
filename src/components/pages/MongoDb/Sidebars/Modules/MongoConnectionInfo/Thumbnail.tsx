import { Info } from "@mui/icons-material";
import { MongoSidebarModuleThumbnailTemplate } from "../Templates";
import { FC } from "react";

export const MongoConnectionInfoThumbnail: FC = () => {
  return (
    <MongoSidebarModuleThumbnailTemplate
      icon={<Info sx={{ fontSize: "1.5rem" }} />}
      label="Connection Info"
      moduleKey="connection-info"
      side={"left"}
      keyBinding="Meta+4"
    />
  );
};
