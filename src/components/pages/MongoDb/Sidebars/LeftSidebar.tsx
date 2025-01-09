import { FC } from "react";
import { useAtomValue } from "jotai";
import {
  MongoLeftSidebarModuleActiveAtom,
  MongoLeftSidebarModuleAtom,
} from "@/store";
import { Box, Tab, Tabs, useTheme } from "@mui/material";
import { MongoSidebarModuleRegistry } from "@/components/pages/MongoDb/Sidebars/Registry.ts";

export const MongoLeftSidebar: FC = () => {
  const modules = useAtomValue(MongoLeftSidebarModuleAtom);
  const activeModule = useAtomValue(MongoLeftSidebarModuleActiveAtom);

  const _theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Sidebar Tabs */}
      <Box
        sx={{
          width: 60,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          borderRight: "1px solid",
          borderColor: "divider",
          gap: 1,
        }}
      >
        <Tabs
          orientation="vertical"
          value={activeModule}
          TabIndicatorProps={{
            sx: {
              transform: "unset !important",
              width: "4px",
              borderRadius: 0,
              left: 0,
            },
          }}
          sx={{
            width: "100%",
          }}
        >
          <Tab
            value={null}
            sx={{
              p: "0 !important",
              height: "0 !important",
              minHeight: "0 !important",
            }}
          />
          {modules.map((moduleKey) => (
            <Tab
              key={`thumbnail-${moduleKey}`}
              value={moduleKey}
              label={MongoSidebarModuleRegistry.getModuleThumbnail(moduleKey)}
              sx={{
                p: "0 !important",
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Sidebar Content */}
      <Box
        sx={{
          width: "calc(100% - 60px)",
          overflow: "hidden",
          display: "flex",
          p: 0,
          position: "relative",
        }}
      >
        {modules.map((moduleKey) => (
          <Box
            key={`panel-${moduleKey}`}
            sx={{
              display: activeModule === moduleKey ? "block" : "none",
              width: "100%",
              height: "100%",
            }}
          >
            {MongoSidebarModuleRegistry.getModulePanel(moduleKey)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
