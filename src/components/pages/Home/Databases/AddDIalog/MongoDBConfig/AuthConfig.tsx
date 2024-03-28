import React from "react";
import MongoDbConnectionParams from "@/store/types/database/mongo.types";
import {
  Box,
  TextField,
  Grid,
  Typography,
  InputAdornment,
} from "@mui/material";
import StyledChoiceButton from "@/components/common/StyledChoiceButton";

interface Props {
  authConfig: MongoDbConnectionParams["auth"];
  setAuthConfig: (config: MongoDbConnectionParams["auth"]) => void;
}
const AuthConfig: React.FC<Props> = ({ authConfig, setAuthConfig }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
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
            Authentication Method
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <StyledChoiceButton
                active={authConfig.method === "none"}
                onClick={() =>
                  setAuthConfig({
                    ...authConfig,
                    method: "none",
                  })
                }
                sx={{
                  py: 3,
                }}
              >
                None
              </StyledChoiceButton>
            </Grid>
            <Grid item xs={3}>
              <StyledChoiceButton
                active={authConfig.method === "password"}
                onClick={() =>
                  setAuthConfig({
                    ...authConfig,
                    method: "password",
                    passwordParams: {
                      username: "",
                      password: "",
                      authDb: "",
                      authMechanism: "DEFAULT",
                    },
                  })
                }
                sx={{
                  py: 3,
                }}
              >
                Password
              </StyledChoiceButton>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        {authConfig.method === "password" && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Username"
                value={authConfig.passwordParams.username}
                onChange={(e) =>
                  setAuthConfig({
                    ...authConfig,
                    passwordParams: {
                      ...authConfig.passwordParams,
                      username: e.target.value,
                    },
                  })
                }
                sx={{
                  "& fieldset": {
                    borderRadius: 4,
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={authConfig.passwordParams.password}
                onChange={(e) =>
                  setAuthConfig({
                    ...authConfig,
                    passwordParams: {
                      ...authConfig.passwordParams,
                      password: e.target.value,
                    },
                  })
                }
                sx={{
                  "& fieldset": {
                    borderRadius: 4,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Authentication Database"
                value={authConfig.passwordParams.authDb}
                onChange={(e) =>
                  setAuthConfig({
                    ...authConfig,
                    passwordParams: {
                      ...authConfig.passwordParams,
                      authDb: e.target.value,
                    },
                  })
                }
                sx={{
                  "& fieldset": {
                    borderRadius: 4,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2" color="text.secondary">
                        Optional
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    Authentication Mechanism
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <StyledChoiceButton
                    active={
                      authConfig.passwordParams.authMechanism === "DEFAULT"
                    }
                    onClick={() =>
                      setAuthConfig({
                        ...authConfig,
                        passwordParams: {
                          ...authConfig.passwordParams,
                          authMechanism: "DEFAULT",
                        },
                      })
                    }
                    sx={{
                      py: 3,
                    }}
                  >
                    Default
                  </StyledChoiceButton>
                </Grid>
                <Grid item xs={4}>
                  <StyledChoiceButton
                    active={
                      authConfig.passwordParams.authMechanism === "SCRAM-SHA-1"
                    }
                    onClick={() =>
                      setAuthConfig({
                        ...authConfig,
                        passwordParams: {
                          ...authConfig.passwordParams,
                          authMechanism: "SCRAM-SHA-1",
                        },
                      })
                    }
                    sx={{
                      py: 3,
                    }}
                  >
                    SCRAM-SHA-1
                  </StyledChoiceButton>
                </Grid>
                <Grid item xs={4}>
                  <StyledChoiceButton
                    active={
                      authConfig.passwordParams.authMechanism ===
                      "SCRAM-SHA-256"
                    }
                    onClick={() =>
                      setAuthConfig({
                        ...authConfig,
                        passwordParams: {
                          ...authConfig.passwordParams,
                          authMechanism: "SCRAM-SHA-256",
                        },
                      })
                    }
                    sx={{
                      py: 3,
                    }}
                  >
                    SCRAM-SHA-256
                  </StyledChoiceButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default AuthConfig;
