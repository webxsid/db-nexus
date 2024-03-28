import React from "react";
import Render from "@/components/common/Render";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Cancel, Check, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { GetArrayReturnType } from "@/helpers/types";
import { Databases } from "@/store/types";
import { SupportedDatabases } from "@/components/common/types";
import { testDBConnection } from "@/utils/database";
interface Props {
  dbState: GetArrayReturnType<Databases>;
  selectedDb: SupportedDatabases;
  handleNext: () => void;
  handlePrevious: () => void;
}

const TestConnection: React.FC<Props> = ({
  dbState,
  selectedDb,
  handleNext,
  handlePrevious,
}) => {
  const [testState, setTestState] = React.useState<
    "idle" | "running" | "success" | "error"
  >("idle");
  const [testMessage, _setTestMessage] = React.useState<string>(
    "Connection Successful"
  );

  const testConnection = async () => {
    setTestState("running");
    _setTestMessage("Testing Connection...");
    console.log("dbState", dbState);
    console.log("selectedDb", selectedDb);
    const timeOut = setTimeout(() => {
      setTestState("error");
      _setTestMessage("Connection Timed Out");
    }, 10000);
    const isSuccess = await testDBConnection(selectedDb)(dbState);
    clearTimeout(timeOut);
    setTestState(isSuccess ? "success" : "error");
    _setTestMessage(isSuccess ? "Connection Successful" : "Connection Failed");
  };
  return (
    <Render
      if={testState !== "idle"}
      then={
        <Box
          sx={{
            display: "flex",
            justifyContent:
              testState === "running" ? "center" : "space-between",
            flexDirection: testState === "error" ? "row-reverse" : "row",
            alignItems: "center",
            width: "100%",
            borderRadius: 4,
            px: 2,
            py: 1,
            border: 1,
            borderColor:
              testState === "running"
                ? "background.paper"
                : testState === "success"
                ? "success.dark"
                : "error.dark",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Render
              if={testState === "running"}
              then={<CircularProgress size={20} />}
              else={
                <Render
                  if={testState === "success"}
                  then={<Check />}
                  else={<Cancel />}
                />
              }
            />

            <Typography variant="body2">{testMessage}</Typography>
          </Box>
          <Render
            if={testState === "success"}
            then={
              <Button
                variant="text"
                color="success"
                disableElevation
                disableRipple
                onClick={handleNext}
                endIcon={<ChevronRight />}
              >
                Customize Database
              </Button>
            }
          />
          <Render
            if={testState === "error"}
            then={
              <Button
                variant="text"
                color="error"
                disableElevation
                disableRipple
                onClick={handlePrevious}
                startIcon={<ChevronLeft />}
              >
                Configure Again
              </Button>
            }
          />
        </Box>
      }
      else={
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderRadius: 4,
            px: 2,
            py: 1,
            border: 1,
            borderColor: "background.paper",
          }}
        >
          <Button
            variant="text"
            color="error"
            disableElevation
            disableRipple
            onClick={handlePrevious}
            startIcon={<ChevronLeft />}
          >
            Go Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            disableElevation
            disableRipple
            onClick={testConnection}
            sx={{ borderRadius: 3 }}
          >
            Test Connection
          </Button>
        </Box>
      }
    />
  );
};

export default TestConnection;
