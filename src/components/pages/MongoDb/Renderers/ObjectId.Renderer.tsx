import { FC } from "react";
import { Box, darken, Typography } from "@mui/material";

export interface IObjectIdRendererProps {
  fieldName: string;
  value: string;
  level: number;
}

export const ObjectIdRenderer: FC<IObjectIdRendererProps> = ({ fieldName, value, level }) => {
  return (
    <Box
      className="objectid-renderer"
      data-testid={`object-renderer-${fieldName}`}
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
            role="button"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
            noWrap
            variant="body2"
            component="span"
            sx={{
              cursor: "pointer",
              color: "text.secondary",
              maxWidth: "350px",
              "& .color-objectId": {
                color: (theme) => darken(theme.palette.primary.main, 0.6),
                fontFamily: "monospace",
              },
              "&:hover": {
                color: "primary.main",
                textDecoration: "underline",
              }
            }}
          >
            <span className="color-objectId">ObjectId(</span>"{value}"<span className="color-objectId">)</span>
          </Typography>
        </Box>
        <Typography variant="caption" sx={{
          whiteSpace: "nowrap",
          color: (theme) => darken(theme.palette.text.secondary, 0.6)
        }}>
          ObjectID
        </Typography>
      </Box>
    </Box>
  );
};
