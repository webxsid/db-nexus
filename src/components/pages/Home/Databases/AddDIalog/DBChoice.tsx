import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import {
  SupportedDBArray,
  DatabaseIcons,
  SupportedDatabases,
} from "@/components/common/types";
import { Storage } from "@mui/icons-material";
import StyledChoiceButton from "@/components/common/StyledChoiceButton";
interface Props {
  selectedDB: SupportedDatabases;
  setSelectedDB: React.Dispatch<SupportedDatabases>;
  handleNext: () => void;
}
const DBChoice: React.FC<Props> = ({
  selectedDB,
  setSelectedDB,
  handleNext,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="caption">
          Please select the database type you want to add
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {SupportedDBArray.map((db) => (
            <Grid item xs={3} key={db}>
              <StyledChoiceButton
                active={selectedDB === db}
                sx={{
                  "& img": {
                    width: "130px",
                  },
                }}
                onClick={() => setSelectedDB(db)}
              >
                <img src={DatabaseIcons[db]} alt={db} />
              </StyledChoiceButton>
            </Grid>
          ))}
          <Grid item xs={3}>
            <Button
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                backgroundColor: `background.paper`,
                py: 1,
                borderRadius: 5,
                border: 1,
                height: "100%",
                borderColor: "background.paper",
                textTransform: "none",
              }}
              disabled
            >
              <Storage />
              <Typography variant="body1">More coming soon</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 1,
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disableElevation
            disableRipple
            onClick={handleNext}
            sx={{ borderRadius: 3 }}
          >
            Configure Database
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};
export default DBChoice;
