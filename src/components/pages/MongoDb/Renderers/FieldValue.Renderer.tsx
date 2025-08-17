import { FC } from "react";
import { Box, Button, darken, SxProps, Theme, Typography } from "@mui/material";

export interface IFieldValueRendererProps {
  value: string | number | boolean | null | undefined;
  sx?: SxProps<Theme>;
  formatValue?: (value: string | number | boolean | null | undefined) => string;
  onClick?: (value: string | number | boolean | null | undefined) => void;
}

export const FieldValueRenderer: FC<IFieldValueRendererProps> = ({ value, sx, formatValue, onClick }) => {
  const formattedValue = formatValue ? formatValue(value) : value;

  const baseSx: SxProps<Theme> = (theme) => ({
    cursor: "pointer",
    color: "text.secondary",
    fontFamily: "monospace",
    maxWidth: "320px",
    [theme.containerQueries.md]: {
      maxWidth: 300,
    },
    [theme.containerQueries.lg]: {
      maxWidth: 400,
    },
    "&:hover": {
      color: "primary.main",
    },
    "&:active": {
      color: darken(theme.palette.primary.main, 0.2),
    },
    "& * .object-id-color": {
      color: darken(theme.palette.primary.main, 0.2),
    }
  });

  const composedSx: SxProps<Theme> = Array.isArray(sx) ? [baseSx, ...sx] : [baseSx, sx];

  return (
    <Typography
      role="button"
      tabIndex={-1} // Prevent button from being focusable
      onClick={(e) => {
        e.stopPropagation(); // Prevent click from bubbling up
        if (onClick) onClick(value);
      }}
      noWrap
      variant="body2"
      sx={composedSx}
    >
      {
        typeof formattedValue === "string" && formattedValue.startsWith("<span") && formattedValue.endsWith("</span>")
          ? <span dangerouslySetInnerHTML={{ __html: formattedValue }} />
          : formattedValue
      }
    </Typography>
  )
}
