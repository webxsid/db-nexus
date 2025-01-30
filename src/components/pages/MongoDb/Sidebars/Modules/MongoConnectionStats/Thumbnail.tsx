import { Analytics, AnalyticsOutlined } from "@mui/icons-material";
import { MongoSidebarModuleThumbnailTemplate } from "../Templates";
import { FC } from "react";

export const MongoConnectionInfoThumbnail: FC = () => {
  return (
    <MongoSidebarModuleThumbnailTemplate
      icon={<AnalyticsOutlined sx={{ fontSize: "1.5rem" }} />}
      activeIcon={<Analytics sx={{ fontSize: "1.5rem" }} />}
      label="Stats"
      moduleKey="stats"
      side={"left"}
      keyBinding="Meta+3"
    />
  );
};
