import { FC } from "react";
import { Box, Typography } from "@mui/material";
import type { TRendererProps } from "../Registry";
import { FieldName } from "../FieldName";

export const TimestampNode: FC<TRendererProps> = ({ fieldName, norm }) => {
  const { t, i } = norm.value as { t: number; i: number };
  return (
    <Box sx={{ width: "100%", overflowX: "auto", display: "flex", gap: 1 }}>
      <FieldName name={`${fieldName}:`} />
      <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
        Timestamp(t:{t}, i:{i})
      </Typography>
    </Box>
  );
};
