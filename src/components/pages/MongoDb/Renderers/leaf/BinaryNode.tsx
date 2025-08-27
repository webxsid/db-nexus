import { FC, useMemo } from "react";
import { Box, Chip, Typography } from "@mui/material";
import type { TRendererProps } from "../Registry";
import { FieldName } from "../FieldName";

export const BinaryNode: FC<TRendererProps> = ({ fieldName, norm }) => {
  const { base64, subType } = norm.value as { base64: string; subType?: string };
  const bytes = useMemo(() => {
    try { return Buffer.from(base64, "base64").length; } catch { return undefined; }
  }, [base64]);

  return (
    <>
      <Box sx={{ width: "100%", overflowX: "auto", display: "flex", gap: 1 }}>
        <FieldName name={`${fieldName}:`} />
        <Chip size="small" label={`bin:${subType ?? "00"}`} sx={{ mr: .5 }} />
        <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
          {bytes != null ? `${bytes} bytes` : "binary"}
        </Typography>
      </Box>
    </>
  );
};
