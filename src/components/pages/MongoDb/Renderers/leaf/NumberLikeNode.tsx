import { FC } from "react";
import { Box, Typography } from "@mui/material";
import type { TRendererProps } from "../Registry";
import { FieldName } from "../FieldName";

export const NumberLikeNode: FC<TRendererProps> = ({ fieldName, norm }) => (
  <Box sx={{ width: "100%", overflowX: "auto", display: "flex", gap: 1 }}>
    <FieldName name={`${fieldName}:`} />
    <Typography variant="body2" sx={{ fontFamily: "monospace", color: (t) => t.palette.primary.main }}>
      {String(norm.value)}
    </Typography>
  </Box>
);
