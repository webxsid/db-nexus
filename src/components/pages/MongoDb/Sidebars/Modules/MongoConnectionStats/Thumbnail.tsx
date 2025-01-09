import { Analytics } from "@mui/icons-material";
import { MongoSidebarModuleThumbnailTemplate } from "../Templates";
import { FC } from "react";

export const MongoConnectionInfoThumbnail: FC = () => {
  return (
    <MongoSidebarModuleThumbnailTemplate
      icon={<Analytics sx={{ fontSize: "1.5rem" }} />}
      label="Stats"
      moduleKey="stats"
      side={"left"}
      keyBinding="Meta+3"
    />
  );
};
