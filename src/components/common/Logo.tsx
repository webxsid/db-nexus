import { DarkModeAtom } from "@/store";
import logoDark from "@assets/logo/logo-dark.svg";
import logo from "@assets/logo/logo.svg";
import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import * as React from "react";
import Render from "./Render";

export interface ILogoProps {
  forceLight?: boolean;
  forceDark?: boolean;
  showText?: boolean;
  width?: number | string;
  height?: number | string;
}
const Logo: React.FC<ILogoProps> = ({
  forceDark,
  forceLight,
  showText,
  width,
  height,
}) => {
  const [darkMode] = useAtom(DarkModeAtom);
  const [isDark, setIsDark] = React.useState<boolean>(darkMode);

  React.useEffect(() => {
    if (forceDark) {
      setIsDark(true);
    } else if (forceLight) {
      setIsDark(false);
    }
  }, [forceDark, forceLight]);

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <img
        src={isDark ? logoDark : logo}
        alt="DB Nexus Logo"
        width={width ?? 40}
        height={height ?? 40}
      />
      <Render
        if={showText}
        then={
          <Typography variant="h6" color="textPrimary">
            DB Nexus
          </Typography>
        }
      />
    </Box>
  );
};

export default Logo;
