import { FC } from "react";
import { Box, Chip, Typography } from "@mui/material";
import type { TRendererProps } from "../Registry";
import { FieldName } from "../FieldName";

export const MiscNode: FC<TRendererProps> = ({ fieldName, norm }) => (
  <>
    <Box sx={{ width: "100%", overflowX: "auto", display: "flex", gap: 1 }}>
      <FieldName name={`${fieldName}:`} />
      <Chip size="small" label={norm.kind} sx={{ mr: .5 }} />
      {norm.kind === "symbol" ? (
        <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
          {String(norm.value)}
        </Typography>
      ) : null}
    </Box>
  </>
);
