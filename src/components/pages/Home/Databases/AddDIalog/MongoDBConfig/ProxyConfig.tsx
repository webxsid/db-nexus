import React from "react";
import MongoDbConnectionParams from "@/store/types/database/mongo.types";
import { useDropzone } from "react-dropzone";
import {
  Grid,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import { DocumentScanner } from "@mui/icons-material";
import Render from "@/components/common/Render";
import StyledChoiceButton from "@/components/common/StyledChoiceButton";

interface Props {
  proxyConfig: MongoDbConnectionParams["proxy"];
  setProxyConfig: (config: MongoDbConnectionParams["proxy"]) => void;
}
const ProxyConfig: React.FC<Props> = ({ proxyConfig, setProxyConfig }) => {
  const onDropProxyFile = React.useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const filePath = window.uploadFile(file);
      setProxyConfig({
        ...proxyConfig,
        proxyParams: {
          ...proxyConfig.proxyParams,
          proxyIdentityFile: filePath,
        },
      });
    },
    [proxyConfig, setProxyConfig]
  );
  const removeFile = () => {
    const filePath = proxyConfig.proxyParams?.proxyIdentityFile;
    setProxyConfig({
      ...proxyConfig,
      proxyParams: {
        ...proxyConfig.proxyParams,
        proxyIdentityFile: undefined,
      },
    });
    window.removeFile(filePath);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropProxyFile,
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
            Proxy Method
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <StyledChoiceButton
                active={proxyConfig.method === "None"}
                onClick={() =>
                  setProxyConfig({
                    ...proxyConfig,
                    method: "None",
                  })
                }
                sx={{
                  py: 2,
                }}
              >
                None
              </StyledChoiceButton>
            </Grid>
            <Grid item xs={3}>
              <StyledChoiceButton
                active={proxyConfig.method === "SSH-Password"}
                onClick={() =>
                  setProxyConfig({
                    ...proxyConfig,
                    method: "SSH-Password",
                  })
                }
                sx={{
                  py: 2,
                }}
              >
                SSH with password
              </StyledChoiceButton>
            </Grid>
            <Grid item xs={3}>
              <StyledChoiceButton
                active={proxyConfig.method === "SSH-IdentityFile"}
                onClick={() =>
                  setProxyConfig({
                    ...proxyConfig,
                    method: "SSH-IdentityFile",
                  })
                }
                sx={{
                  py: 2,
                }}
              >
                SSH with identity file
              </StyledChoiceButton>
            </Grid>
            <Grid item xs={2}>
              <StyledChoiceButton
                active={proxyConfig.method === "Socks5"}
                onClick={() =>
                  setProxyConfig({
                    ...proxyConfig,
                    method: "Socks5",
                  })
                }
                sx={{
                  py: 2,
                }}
              >
                Socks5
              </StyledChoiceButton>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Render
          if={proxyConfig.method !== "None" && proxyConfig.method !== "Socks5"}
          then={
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="SSH Hostname"
                  fullWidth
                  value={proxyConfig.proxyParams?.proxyHost || ""}
                  onChange={(e) => {
                    setProxyConfig({
                      ...proxyConfig,
                      proxyParams: {
                        ...proxyConfig.proxyParams,
                        proxyHost: e.target.value,
                      },
                    });
                  }}
                  sx={{
                    "& fieldset": {
                      borderRadius: 4,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="SSH Port"
                  fullWidth
                  value={proxyConfig.proxyParams?.proxyPort || ""}
                  onChange={(e) => {
                    setProxyConfig({
                      ...proxyConfig,
                      proxyParams: {
                        ...proxyConfig.proxyParams,
                        proxyPort: e.target.value,
                      },
                    });
                  }}
                  sx={{
                    "& fieldset": {
                      borderRadius: 4,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="SSH Username"
                  fullWidth
                  value={proxyConfig.proxyParams?.proxyUsername || ""}
                  onChange={(e) => {
                    setProxyConfig({
                      ...proxyConfig,
                      proxyParams: {
                        ...proxyConfig.proxyParams,
                        proxyUsername: e.target.value,
                      },
                    });
                  }}
                  sx={{
                    "& fieldset": {
                      borderRadius: 4,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Render
                  if={proxyConfig.method === "SSH-Password"}
                  then={
                    <TextField
                      label="SSH Password"
                      fullWidth
                      type="password"
                      value={proxyConfig.proxyParams?.proxyPassword || ""}
                      onChange={(e) => {
                        setProxyConfig({
                          ...proxyConfig,
                          proxyParams: {
                            ...proxyConfig.proxyParams,
                            proxyPassword: e.target.value,
                          },
                        });
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Optional
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& fieldset": {
                          borderRadius: 4,
                        },
                      }}
                    />
                  }
                  else={
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body1">
                          SSH Identity File
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          (.pem)
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Optional
                        </Typography>
                      </Box>
                      <Render
                        if={proxyConfig?.proxyParams?.proxyIdentityFile}
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
                                {proxyConfig?.proxyParams?.proxyIdentityFile
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
                            {...getRootProps()}
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
                            <input {...getInputProps()} />
                            <Render
                              if={isDragActive}
                              then={
                                <Typography variant="body2">
                                  Drop the files here...
                                </Typography>
                              }
                              else={
                                <Typography variant="body2">
                                  Drag 'n' drop some files here, or click to
                                  select files
                                </Typography>
                              }
                            />
                          </Box>
                        }
                      />
                      <Grid
                        item
                        xs={12}
                        sx={{
                          mt: 2,
                        }}
                      >
                        <TextField
                          label="SSH Passphrase"
                          fullWidth
                          type="password"
                          value={proxyConfig.proxyParams?.proxyPassphrase || ""}
                          onChange={(e) => {
                            setProxyConfig({
                              ...proxyConfig,
                              proxyParams: {
                                ...proxyConfig.proxyParams,
                                proxyPassphrase: e.target.value,
                              },
                            });
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Optional
                                </Typography>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& fieldset": {
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Grid>
                    </>
                  }
                />
              </Grid>
            </Grid>
          }
          else={
            <Render
              if={proxyConfig.method === "Socks5"}
              then={
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Proxy Hostname"
                      fullWidth
                      value={proxyConfig.proxyParams?.proxyHost || ""}
                      onChange={(e) => {
                        setProxyConfig({
                          ...proxyConfig,
                          proxyParams: {
                            ...proxyConfig.proxyParams,
                            proxyHost: e.target.value || undefined,
                          },
                        });
                      }}
                      sx={{
                        "& fieldset": {
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Proxy Tunnel Port"
                      type="number"
                      fullWidth
                      value={proxyConfig.proxyParams?.proxyPort || ""}
                      onChange={(e) => {
                        setProxyConfig({
                          ...proxyConfig,
                          proxyParams: {
                            ...proxyConfig.proxyParams,
                            proxyPort: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          },
                        });
                      }}
                      sx={{
                        "& fieldset": {
                          borderRadius: 4,
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Optional
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Proxy Username"
                      fullWidth
                      value={proxyConfig.proxyParams?.proxyUsername || ""}
                      onChange={(e) => {
                        setProxyConfig({
                          ...proxyConfig,
                          proxyParams: {
                            ...proxyConfig.proxyParams,
                            proxyUsername: e.target.value || undefined,
                          },
                        });
                      }}
                      sx={{
                        "& fieldset": {
                          borderRadius: 4,
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Optional
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Proxy Password"
                      fullWidth
                      type="password"
                      value={proxyConfig.proxyParams?.proxyPassword || ""}
                      onChange={(e) => {
                        setProxyConfig({
                          ...proxyConfig,
                          proxyParams: {
                            ...proxyConfig.proxyParams,
                            proxyPassword: e.target.value || undefined,
                          },
                        });
                      }}
                      sx={{
                        "& fieldset": {
                          borderRadius: 4,
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Optional
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              }
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export default ProxyConfig;
