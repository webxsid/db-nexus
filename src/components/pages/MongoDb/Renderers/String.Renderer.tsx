import { FC } from "react";
import { Box, darken, Typography } from "@mui/material";

export interface IStringRendererProps {
  fieldName: string;
  value: string;
  level: number;
}

export const StringRenderer: FC<IStringRendererProps> = ({ fieldName, value, level }) => {
  return (
    <Box
      className="string-renderer"
      data-testid={`string-renderer-${fieldName}`}
      sx={{
        paddingLeft: 0,
        paddingBottom: level === 0 ? 1 : 0,
        position: "relative",
        width: "100%",
      }}
    >
      <Box sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Box sx={{ width: "100%", marginBottom: 0.5, display: "flex", gap: 1, }}>
          <Typography variant="body2" component="span" sx={{ fontWeight: "bold" }}>
            {fieldName}:
          </Typography>
          <Typography
            noWrap
            variant="body2"
            component="span"
            sx={{
              color: "text.secondary",
              maxWidth: "350px"
            }}
          >
            {value}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{
          whiteSpace: "nowrap",
          color: (theme) => darken(theme.palette.text.secondary, 0.6)
        }}>
          String
        </Typography>
      </Box>
    </Box>
  );
};
