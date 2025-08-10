import { FC, ReactNode, useMemo } from "react";
import { mongoActiveTabsAtom, mongoSelectedTabAtom } from "@/store";
import { Box, } from "@mui/material";
import { useAtomValue } from "jotai";
import { MongoConnectionTanPanel } from "./ConnectionPanel.tsx"
import { MongoDatabaseTabPanel } from "./DatabasePanel.tsx";
import { MongoCollectionTabPanel } from "./CollectionPanel.tsx";

export const MongoTabPanels: FC = () => {
  const activeTabs = useAtomValue(mongoActiveTabsAtom);
  const selectedTabId = useAtomValue(mongoSelectedTabAtom);

  const selectedIndex = useMemo<number | false>(() => {
    const index = activeTabs.findIndex((tab) => tab.id === selectedTabId);
    return index !== -1 ? index : false;
  }, [activeTabs, selectedTabId]);

  return (
    <Box component={"section"} sx={{ width: "100%", height: "100%", overflow: "hidden", p: 1 }}>
      {
        selectedIndex !== false && activeTabs.map((tab, index) => (
          <TabPanel value={selectedIndex} index={index} key={tab.id} >
            {
              tab.type === "connection" ? (
                <MongoConnectionTanPanel />
              ) : tab.type === "database" ? (
                <MongoDatabaseTabPanel databaseName={tab.database} />
              ) : tab.type === "collection" ? (
                <MongoCollectionTabPanel
                  databaseName={tab.database}
                  collectionName={tab.collection}
                />
              ) : null
            }
          </TabPanel>
        ))
      }
    </Box>
  )
}

export interface ITabPanelProps {
  value: number;
  index: number;
  children: ReactNode;
}
export const TabPanel: FC<ITabPanelProps> = ({ value, index, children }) => {
  return (
    <Box
      hidden={value !== index}
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      {value === index && children}
    </Box>
  );
};
