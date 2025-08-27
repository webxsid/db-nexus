import { FC } from "react";
import { alpha, Box, SxProps } from "@mui/material";

export const TypeBadge: FC<{ kind: string, sx?: SxProps }> = ({ kind, sx }) => (
  <Box
    component="span"
    sx={{
      px: 0.75,
      py: 0.25,
      fontSize: 10,
      letterSpacing: 0.3,
      textTransform: "uppercase",
      color: (t) => alpha(t.palette.text.primary, 0.6),
      userSelect: "none",
      pointerEvents: "none",
      ...sx
    }}
  >
    {kind}
  </Box>
);
