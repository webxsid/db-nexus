import React from "react";
import MongoDbConnectionParams from "@/store/types/database/mongo.types";
import {
  Box,
  TextField,
  Grid,
  Typography,
  InputAdornment,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import StyledChoiceButton from "@/components/common/StyledChoiceButton";
import { useDropzone } from "react-dropzone";
import Render from "@/components/common/Render";
import { DocumentScanner } from "@mui/icons-material";

interface Props {
  tlsConfig: MongoDbConnectionParams["tls"];
  setTlsConfig: (config: MongoDbConnectionParams["tls"]) => void;
}
const TLSConfig: React.FC<Props> = ({ tlsConfig, setTlsConfig }) => {
  const onDropCAFile = React.useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const filePath = await window.uploadFile(file);
      console.log("filePath: ", filePath);
      setTlsConfig({
        ...tlsConfig,
        tlsParams: {
          ...tlsConfig.tlsParams,
          tlsCAFile: filePath,
        },
      });
    },
    [tlsConfig, setTlsConfig]
  );

  const onDropKeyFile = React.useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const filePath = await window.uploadFile(file);
      setTlsConfig({
        ...tlsConfig,
        tlsParams: {
          ...tlsConfig.tlsParams,
          tlsCertificateKeyFile: filePath,
        },
      });
    },
    [tlsConfig, setTlsConfig]
  );

  const removeFile = (key: string) => {
    const filepath =
      tlsConfig?.tlsParams[
        key as keyof MongoDbConnectionParams["tls"]["tlsParams"]
      ];
    setTlsConfig({
      ...tlsConfig,
      tlsParams: {
        ...tlsConfig.tlsParams,
        [key]: undefined,
      },
    });
    window.removeFile(filepath);
  };

  const {
    getRootProps: getRootPropsCA,
    getInputProps: getInputPropsCA,
    isDragActive: isDragActiveCA,
  } = useDropzone({
    onDrop: onDropCAFile,
    useFsAccessApi: false,
  });

  const {
    getRootProps: getRootPropsKey,
    getInputProps: getInputPropsKey,
    isDragActive: isDragActiveKey,
  } = useDropzone({
    onDrop: onDropKeyFile,
    useFsAccessApi: false,
  });
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
            TLS Connection
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <StyledChoiceButton
                active={tlsConfig.state === "Default"}
                onClick={() =>
                  setTlsConfig({
                    ...tlsConfig,
                    state: "Default",
                  })
                }
                sx={{
                  py: 3,
                }}
              >
                Default
              </StyledChoiceButton>
            </Grid>
            <Grid item xs={3}>
              <StyledChoiceButton
                active={tlsConfig.state === "Enabled"}
                onClick={() =>
                  setTlsConfig({
                    ...tlsConfig,
                    state: "Enabled",
                  })
                }
                sx={{
                  py: 3,
                }}
              >
                Enabled
              </StyledChoiceButton>
            </Grid>
            <Grid item xs={3}>
              <StyledChoiceButton
                active={tlsConfig.state === "Disabled"}
                onClick={() =>
                  setTlsConfig({
                    ...tlsConfig,
                    state: "Disabled",
                  })
                }
                sx={{
                  py: 3,
                }}
              >
                Disabled
              </StyledChoiceButton>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body1">Certificate Authority </Typography>
              <Typography variant="caption" color="text.secondary">
                (.pem)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Optional
              </Typography>
            </Box>
            <Render
              if={!!tlsConfig?.tlsParams?.tlsCAFile}
              then={
                <Chip
                  sx={{
                    py: 3,
                    px: 2,
                    mt: 1,
                  }}
                  icon={<DocumentScanner />}
                  label={
                    <Typography variant="body2" noWrap>
                      {tlsConfig?.tlsParams?.tlsCAFile?.split("/").pop() ||
                        "File"}
                    </Typography>
                  }
                  onDelete={() => {
                    removeFile("tlsCAFile");
                  }}
                />
              }
              else={
                <Box
                  {...getRootPropsCA()}
                  sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    border: "1px dashed",
                    borderColor: "text.disabled",
                    borderRadius: 4,
                    px: 2,
                    py: 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <input {...getInputPropsCA()} />
                  <Render
                    if={isDragActiveCA}
                    then={
                      <Typography variant="body2">
                        Drop the files here...
                      </Typography>
                    }
                    else={
                      <Typography variant="body2">
                        Drag 'n' drop some files here, or click to select files
                      </Typography>
                    }
                  />
                </Box>
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body1">
                Client Certificate and Key
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (.pem)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Optional
              </Typography>
            </Box>
            <Render
              if={!!tlsConfig?.tlsParams?.tlsCertificateKeyFile}
              then={
                <Chip
                  sx={{
                    py: 3,
                    px: 2,
                    mt: 1,
                  }}
                  icon={<DocumentScanner />}
                  label={
                    <Typography variant="body2" noWrap>
                      {tlsConfig?.tlsParams?.tlsCertificateKeyFile
                        ?.split("/")
                        .pop()}
                    </Typography>
                  }
                  onDelete={() => {
                    removeFile("tlsCertificateKeyFile");
                  }}
                />
              }
              else={
                <Box
                  {...getRootPropsKey()}
                  sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    border: "1px dashed",
                    borderColor: "text.disabled",
                    borderRadius: 4,
                    px: 2,
                    py: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <input {...getInputPropsKey()} />
                  <Render
                    if={isDragActiveKey}
                    then={
                      <Typography variant="body2">
                        Drop the files here...
                      </Typography>
                    }
                    else={
                      <Typography variant="body2">
                        Drag 'n' drop some files here, or click to select files
                      </Typography>
                    }
                  />
                </Box>
              }
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          mt: 1,
        }}
      >
        <TextField
          label="Client Key Password"
          type="password"
          value={tlsConfig?.tlsParams?.tlsCertificateKeyFilePassword || ""}
          onChange={(e) =>
            setTlsConfig({
              ...tlsConfig,
              tlsParams: {
                ...tlsConfig.tlsParams,
                tlsCertificateKeyFilePassword: e.target.value,
              },
            })
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption">Optional</Typography>
              </InputAdornment>
            ),
          }}
          sx={{
            mt: 1,
            "& fieldset": {
              borderRadius: 4,
            },
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControlLabel
              sx={{
                width: "100%",
                justifyContent: "space-between",
                ml: 0,
              }}
              control={
                <Switch
                  checked={tlsConfig?.insecure || false}
                  onChange={() => {
                    setTlsConfig({
                      ...tlsConfig,
                      insecure: !tlsConfig.insecure,
                    });
                  }}
                />
              }
              label={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Typography>Allow Insecure Connection</Typography>
                    <Typography variant="caption" color="text.secondary">
                      (Insecure)
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    This includes tlsAllowInvalidHostnames and
                    tlsAllowInvalidCertificates.
                  </Typography>
                </Box>
              }
              labelPlacement="start"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              sx={{
                width: "100%",
                justifyContent: "space-between",
                ml: 0,
              }}
              control={
                <Switch
                  checked={tlsConfig?.invalidHostNameAllowed || false}
                  onChange={() => {
                    setTlsConfig({
                      ...tlsConfig,
                      invalidHostNameAllowed: !tlsConfig.invalidHostNameAllowed,
                    });
                  }}
                />
              }
              label={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Typography>Allow Invalid Hostname</Typography>
                    <Typography variant="caption" color="text.secondary">
                      (Insecure)
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Disable the validation of the hostnames in the certificate
                    presented by the mongod/mongos instance.
                  </Typography>
                </Box>
              }
              labelPlacement="start"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              sx={{
                width: "100%",
                justifyContent: "space-between",
                ml: 0,
              }}
              control={
                <Switch
                  checked={tlsConfig?.invalidCertificateAllowed || false}
                  onChange={() => {
                    setTlsConfig({
                      ...tlsConfig,
                      invalidCertificateAllowed:
                        !tlsConfig.invalidCertificateAllowed,
                    });
                  }}
                />
              }
              label={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Typography>Allow Invalid Certificate</Typography>
                    <Typography variant="caption" color="text.secondary">
                      (Insecure)
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Disable the validation of the server certificates.
                  </Typography>
                </Box>
              }
              labelPlacement="start"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TLSConfig;
