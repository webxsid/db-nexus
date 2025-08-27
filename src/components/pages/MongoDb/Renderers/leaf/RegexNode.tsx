import { FC } from "react";
import { Box, Typography } from "@mui/material";
import type { TRendererProps } from "../Registry";
import { FieldName } from "../FieldName";

export const RegexNode: FC<TRendererProps> = ({ fieldName, norm }) => {
  const { pattern, options } = norm.value as { pattern: string; options: string };
  return (
    <Box sx={{ width: "100%", overflowX: "auto", display: "flex", gap: 1 }}>
      <FieldName name={`${fieldName}:`} />
      <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
        /{pattern}/{options}
      </Typography>
    </Box>
  );
};
