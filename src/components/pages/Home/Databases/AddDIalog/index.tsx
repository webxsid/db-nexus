import React, { ReactElement } from "react";
import StyledDialog from "@/components/common/StyledDialog";
import {
  DialogContent,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import DBChoice from "./DBChoice";
import { toast } from "react-toastify";
import { SupportedDatabases } from "@/components/common/types";
import { Databases } from "@/store/types/database";
import MongoDBConfig from "./MongoDBConfig";
import { GetArrayReturnType } from "@/helpers/types";
import TestConnection from "./TestConnection";
import CustomizeDatabase from "./CustomizeDatabase";
import { useDispatch } from "react-redux";
import { databaseActions } from "@/store/actions";
import { AnyAction } from "redux-saga";
interface Props {
  open: boolean;
  handleClose: () => void;
}

const DatabaseAddDialog: React.FC<Props> = ({ open, handleClose }) => {
  const [step, setStep] = React.useState(0);
  const [selectedDB, setSelectedDB] = React.useState<SupportedDatabases | null>(
    null
  );
  const [_dbConfig, setDBConfig] =
    React.useState<GetArrayReturnType<Databases> | null>(null);
  const [dbConfigElement, setDBConfigElement] =
    React.useState<ReactElement | null>(null);

  const dispatch = useDispatch();

  const resetComponent = () => {
    setStep(0);
    setSelectedDB(null);
    setDBConfig(null);
    setDBConfigElement(null);
  };

  const _nextStep = () => {
    setStep(step + 1);
  };
  const _prevStep = () => {
    setStep(step - 1);
  };
  const proceedToDBConfig = () => {
    if (!selectedDB) {
      toast.error("Please select a database type to proceed");
      return;
    }
    if (selectedDB === SupportedDatabases.MONGO) {
      setDBConfigElement(<MongoDBConfig />);
    }
    setStep(1);
  };
  const proceedToTestConnection = async (
    dbState: GetArrayReturnType<Databases>
  ) => {
    setStep(2);
    console.log("Selected DB", selectedDB);
    setDBConfig(dbState);
  };

  const proceedToCustomize = () => {
    setStep(3);
  };

  const saveDb = async (dbName: string, dbColor: string) => {
    if (!selectedDB) return;
    const newConfig: GetArrayReturnType<Databases> = {
      ..._dbConfig!,
      name: dbName,
      color: dbColor,
      provider: selectedDB,
    };
    setDBConfig(newConfig);
    dispatch<AnyAction>(databaseActions.addDatabase(selectedDB)(newConfig));
    resetComponent();
    handleClose();
  };

  const goBackToDBChoice = () => {
    setSelectedDB(null);
    setStep(0);
  };
  return (
    <StyledDialog open={open} onClose={handleClose} title="Add Database">
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stepper activeStep={step} orientation="vertical">
              <Step>
                <StepLabel>Select Database</StepLabel>
                <StepContent>
                  <DBChoice
                    selectedDB={selectedDB!}
                    setSelectedDB={setSelectedDB}
                    handleNext={proceedToDBConfig}
                  />
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Configure Database</StepLabel>
                <StepContent>
                  <Box>
                    {dbConfigElement &&
                      React.cloneElement(dbConfigElement, {
                        handlePrevious: goBackToDBChoice,
                        handleNext: proceedToTestConnection,
                      })}
                  </Box>
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Test Connection</StepLabel>
                <StepContent>
                  <TestConnection
                    dbState={_dbConfig!}
                    selectedDb={selectedDB!}
                    handleNext={proceedToCustomize}
                    handlePrevious={_prevStep}
                  />
                </StepContent>
              </Step>
              <Step>
                <StepLabel>Customize &amp; Save Database</StepLabel>
                <StepContent>
                  <CustomizeDatabase
                    handleNext={saveDb}
                    handlePrevious={() => setStep(2)}
                  />
                </StepContent>
              </Step>
            </Stepper>
          </Grid>
        </Grid>
      </DialogContent>
    </StyledDialog>
  );
};

export default DatabaseAddDialog;
