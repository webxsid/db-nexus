import { FC } from "react";
import { Box, darken, Typography } from "@mui/material";

export interface IFieldTypeRendererProps {
  type: string;
}
export const FieldTypeRenderer: FC<IFieldTypeRendererProps> = ({ type }) => {
  return (
    <Typography
      variant="caption"
      sx={(theme) => ({
        whiteSpace: "nowrap",
        color: (theme) => darken(theme.palette.text.secondary, 0.6),
        fontFamily: "monospace",
        display: "inline",
        [theme.containerQueries.md]: {
          display: "none",
        },
        [theme.containerQueries.lg]: {
          display: "inline",
        },
      })}
    >
      {type.charAt(0).toUpperCase() + type.slice(1) /* Capitalize the first letter */}
    </Typography>
  )
}
