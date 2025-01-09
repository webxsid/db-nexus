import { SxProps, Typography, TypographyOwnProps, TypographyTypeMap } from "@mui/material";
import { Box } from "@mui/system";
import { ESupportedDatabases } from "@shared";
import { FC, useMemo } from "react";
import firestore from "../../assets/logos/firestore.svg";
import mongoDb from "../../assets/logos/mongodb.svg";

export interface IShowDBProviderOptions {
  provider: string;
  showName?: boolean;
  showLogo?: boolean;
  logoSx?: SxProps;
  sx?: SxProps;
  textSx?: SxProps;
  textVariant?: TypographyOwnProps["variant"];
  textComponent?: TypographyTypeMap["defaultComponent"]
}
const ShowDBProvider: FC<IShowDBProviderOptions> = ({
  provider,
  showLogo,
  showName,
  logoSx,
  sx,
  textSx,
  textVariant,
  textComponent,
}) => {
  const providerDisplayMap = useMemo(
    () => ({
      [ESupportedDatabases.Mongo]: {
        name: "Mongo DB",
        logo: (
          <Box
            component="img"
            src={mongoDb}
            alt="Mongo DB"
            sx={{ width: 24, height: 24, ...logoSx }}
          />
        ),
      },
      [ESupportedDatabases.Firestore]: {
        name: "Firestore",
        logo: (
          <Box
            component="img"
            src={firestore}
            alt="Firestore"
            sx={{ width: 24, height: 24, ...logoSx }}
          />
        ),
      },
    }),
    [logoSx],
  );

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center", ...sx }}>
      {showLogo
        ? providerDisplayMap[provider as ESupportedDatabases].logo
        : null}
      {showName ? (
        <Typography
          variant={textVariant ?? "h6"}
          component={textComponent ?? "h1"}
          align="left"
          color={"text.primary"}
          sx={textSx}
        >
          {providerDisplayMap[provider as ESupportedDatabases].name}
        </Typography>
      ) : null}
    </Box>
  );
};

export default ShowDBProvider;
