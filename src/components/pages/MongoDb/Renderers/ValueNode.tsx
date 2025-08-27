import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { normalizeEJSON } from "./ejson/normalize";
import { getRenderer } from "./Registry";
import { TypeBadge } from "./TypeBadge";
import { TMongoValueKind } from "./ejson";

export type TValueNodeProps = {
  fieldName: string;
  value: unknown;   // raw EJSON value
  level: number;
  path: string[];
};

export const ValueNode: FC<TValueNodeProps> = ({ fieldName, value, level, path }) => {
  const norm = normalizeEJSON(fieldName, value);
  const Comp = getRenderer(norm.kind);

  return (
    <Box sx={{
      pl: level > 1 ? 1 : 0,
      display: "flex",
      alignItems: "center",
      width: "100%",
    }}>
      <Box sx={{ display: "flex", gap: 0.5, alignItems: "baseline", flex: 1, minWidth: 0, overflow: "hidden", width: "100%" }}>
        {Comp ? (
          <Comp fieldName={fieldName} norm={norm} level={level} path={path} />
        ) : (
          <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
            {JSON.stringify(value, null, 2)}
          </Typography>
        )}
      </Box>
      <TypeBadge kind={norm.kind} sx={{
        display: (["object", "array"] as TMongoValueKind[]).includes(norm.kind) ? 'none' : 'inline-block',
      }} />
    </Box>
  );
};
