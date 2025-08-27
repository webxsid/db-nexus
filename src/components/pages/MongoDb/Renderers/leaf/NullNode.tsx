
import { FC } from "react";
import { Box, Typography } from "@mui/material";
import type { TRendererProps } from "../Registry";
import { FieldName } from "../FieldName";

export const NullNode: FC<TRendererProps> = ({ fieldName, norm }) => (
  <Box sx={{ width: "100%", overflowX: "auto", display: "flex", gap: 1 }}>
    <FieldName name={`${fieldName}:`} />
    <Typography variant="body2" sx={{ fontFamily: "monospace", color: (t) => t.palette.text.secondary }}>
      {String(norm.value)}
    </Typography>
  </Box>
);
