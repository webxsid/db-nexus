import StyledChoiceButton from "@/components/common/StyledChoiceButton";
import { useKeybindingManager } from "@/managers";
import { useTheme } from "@emotion/react";
import { Info } from "@mui/icons-material";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { IMongoConnectionParams, TMongoScheme } from "@shared";
import React, { FC, ReactNode, useCallback, useEffect } from "react";

const schemeInfo = {
  mongodb:
    "Standard Connection String Format. The standard format of the MongoDB connection URI is used to connect to a MongoDB deployment: standalone, replica set, or a sharded cluster.",
  "mongodb+srv":
    "DNS Seed List Connection Format. The +srv indicates to the client that the hostname that follows corresponds to a DNS SRV record.",
};

interface IProps {
  isActive: boolean;
  generalConfig: IMongoConnectionParams["general"];
  setGeneralConfig: (config: IMongoConnectionParams["general"]) => void;
}

export const GeneralConfig: FC<IProps> = ({
  isActive,
  generalConfig,
  setGeneralConfig,
}): ReactNode => {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const theme = useTheme();
  const [newHost, setNewHost] = React.useState<string>("");
  const { getKeyComboIcons, registerKeybinding, unregisterKeybinding } =
    useKeybindingManager();

  const selectMongoScheme = useCallback(
    (scheme: string): void => {
      setGeneralConfig({
        ...generalConfig,
        hosts: ["localhost:27017"],
        scheme: scheme as TMongoScheme,
      });
      if (scheme === "mongodb+srv") {
        setGeneralConfig({
          ...generalConfig,
          scheme,
          hosts: ["localhost"],
          directConnection: false,
        });
      }
    },
    [generalConfig, setGeneralConfig],
  );

  const handleSpace = useCallback(() => {
    console.log("Space pressed");
    if (selectedIndex === 0) {
      if (generalConfig.scheme === "mongodb") {
        selectMongoScheme("mongodb+srv");
      } else {
        selectMongoScheme("mongodb");
      }
    } else if (selectedIndex === 1) {
      setGeneralConfig({
        ...generalConfig,
        directConnection: !generalConfig.directConnection,
      });
    }
  }, [selectedIndex, setGeneralConfig, generalConfig, selectMongoScheme]);

  const handleArrowDown = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % 2);
  }, []);

  const handleArrowUp = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % 2);
  }, []);

  useEffect(() => {
    if (isActive) {
      registerKeybinding(["Space"], handleSpace);
      registerKeybinding(["ArrowDown"], handleArrowDown);
      registerKeybinding(["ArrowUp"], handleArrowUp);
    } else {
      unregisterKeybinding(["Space"], handleSpace);
      unregisterKeybinding(["ArrowDown"], handleArrowDown);
      unregisterKeybinding(["ArrowUp"], handleArrowUp);
    }
  }, [
    isActive,
    handleSpace,
    registerKeybinding,
    unregisterKeybinding,
    handleArrowDown,
    handleArrowUp,
  ]);

  return (
    <List sx={{ width: "100%" }}>
      <ListItemButton
        selected={selectedIndex === 0}
        sx={{
          borderRadius: 2,
          py: 1.5,
          pb: 4,
          border: "1px solid",
          borderColor: "transparent",
          backgroundColor: "transparent",
          color: "text.primary",
          my: 0.5,
          "&:hover": {
            backgroundColor: `${theme.palette.primary.main}22`,
            color: "primary.contrastText",
          },
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "background.paper",
            px: 1,
            py: 0.5,
          }}
        >
          {getKeyComboIcons("Space", "small")} to change the scheme
        </Box>
        <ListItemText
          primary={
            <Box
              component={"span"}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography component={"span"} variant="body1">
                Connection String Scheme
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "row", gap: 1 }}
                component={"span"}
              >
                <StyledChoiceButton
                  active={generalConfig.scheme === "mongodb"}
                  onClick={() => selectMongoScheme("mongodb")}
                >
                  mongodb
                </StyledChoiceButton>
                <StyledChoiceButton
                  active={generalConfig.scheme === "mongodb+srv"}
                  onClick={() => selectMongoScheme("mongodb+srv")}
                >
                  mongodb+srv
                </StyledChoiceButton>
              </Box>
            </Box>
          }
          secondary={
            <Box sx={{ mt: 2, pl: 1 }} component={"span"}>
              <Typography
                component={"span"}
                variant="body2"
                sx={{ color: "text.secondary", display: "flex", gap: 1 }}
              >
                <Info sx={{ fontSize: 20 }} />
                {schemeInfo[generalConfig.scheme]}
              </Typography>
            </Box>
          }
        />
      </ListItemButton>
    </List>
  );
};
