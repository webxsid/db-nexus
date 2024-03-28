import React from "react";
import MongoDbConnectionParams from "@/store/types/database/mongo.types";
import {
  Box,
  TextField,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import StyledChoiceButton from "@/components/common/StyledChoiceButton";
import { Add, Info } from "@mui/icons-material";

const schemeInfo = {
  mongodb:
    "Standard Connection String Format. The standard format of the MongoDB connection URI is used to connect to a MongoDB deployment: standalone, replica set, or a sharded cluster.",
  "mongodb+srv":
    "DNS Seed List Connection Format. The +srv indicates to the client that the hostname that follows corresponds to a DNS SRV record.",
};

interface Props {
  generalConfig: MongoDbConnectionParams["general"];
  setGeneralConfig: (config: MongoDbConnectionParams["general"]) => void;
}

const GeneralConfig: React.FC<Props> = ({
  generalConfig,
  setGeneralConfig,
}) => {
  const [newHost, setNewHost] = React.useState<string>("");

  const selectMongoScheme = (scheme: string) => {
    setGeneralConfig({
      ...generalConfig,
      hosts: ["localhost:27017"],
      scheme,
    });
    if (scheme === "mongodb+srv") {
      setGeneralConfig({
        ...generalConfig,
        scheme,
        hosts: ["localhost"],
        directConnection: false,
      });
    }
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
            gap: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Connection Scheme
            {/* What is scheme */}
            <Tooltip title={schemeInfo[generalConfig.scheme]} placement="top">
              <Info
                sx={{
                  fontSize: 14,
                }}
              />
            </Tooltip>
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <StyledChoiceButton
                active={generalConfig.scheme === "mongodb"}
                onClick={() => selectMongoScheme("mongodb")}
                sx={{
                  py: 3,
                }}
              >
                mongodb
              </StyledChoiceButton>
            </Grid>
            <Grid item xs={6}>
              <StyledChoiceButton
                active={generalConfig.scheme === "mongodb+srv"}
                sx={{
                  py: 3,
                }}
                onClick={() => selectMongoScheme("mongodb+srv")}
              >
                mongodb+srv
              </StyledChoiceButton>
            </Grid>
            {generalConfig.scheme !== "mongodb+srv" && (
              <Grid item xs={12}>
                <FormControlLabel
                  sx={{
                    width: "100%",
                    justifyContent: "space-between",
                    ml: 0,
                  }}
                  control={
                    <Switch
                      checked={generalConfig.directConnection}
                      onChange={() => {
                        setGeneralConfig({
                          ...generalConfig,
                          directConnection: !generalConfig.directConnection,
                        });
                      }}
                    />
                  }
                  label="Direct Connection"
                  labelPlacement="start"
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
            gap: 1,
          }}
        >
          <Typography variant="body1">Hosts</Typography>
          <Grid container spacing={2}>
            {generalConfig.scheme === "mongodb+srv" ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  value={generalConfig.hosts[0]}
                  onChange={(e) => {
                    setGeneralConfig({
                      ...generalConfig,
                      hosts: [e.target.value],
                    });
                  }}
                  sx={{
                    "& fieldset": {
                      borderRadius: 4,
                    },
                  }}
                />
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    width: "100%",
                    overflowX: "auto",
                  }}
                >
                  {generalConfig.hosts.map((host, index) => (
                    <Chip
                      key={index}
                      label={host}
                      onDelete={() => {
                        const newHosts = generalConfig.hosts.filter(
                          (_, i) => i !== index
                        );
                        setGeneralConfig({
                          ...generalConfig,
                          hosts: newHosts,
                        });
                      }}
                    />
                  ))}
                </Box>
                <TextField
                  label="Add Host"
                  value={newHost}
                  onChange={(e) => {
                    setNewHost(e.target.value);
                  }}
                  sx={{
                    "& fieldset": {
                      borderRadius: 4,
                    },
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newHost) {
                      setGeneralConfig({
                        ...generalConfig,
                        hosts: [...generalConfig.hosts, newHost],
                      });
                      setNewHost("");
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            if (newHost) {
                              setGeneralConfig({
                                ...generalConfig,
                                hosts: [...generalConfig.hosts, newHost],
                              });
                              setNewHost("");
                            }
                          }}
                        >
                          <Add />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default GeneralConfig;
