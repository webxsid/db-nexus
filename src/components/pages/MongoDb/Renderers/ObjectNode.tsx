import { FC, useState } from "react";
import { Box, Typography } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ValueNode } from "./ValueNode";
import type { TRendererProps } from "./Registry";
import { FieldName } from "./FieldName";
import { TypeBadge } from "./TypeBadge";

export const ObjectNode: FC<TRendererProps> = ({ fieldName, norm, level, path }) => {
  const [expand, setExpand] = useState(false);
  const entries = Object.entries(norm.value as Record<string, unknown>);
  if (level === 0) {
    return (
      <Box sx={{ width: '100%', mt: 1 }}>
        {
          entries.map(([k, v]) => (
            <ValueNode key={k} fieldName={k} value={v} level={level + 1} path={[...path, k]} />
          ))
        }
      </Box>
    )
  }
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", overflowX: "auto", display: "flex", gap: 1, flex: 1, cursor: "pointer" }} role="button" onClick={() => setExpand(!expand)}>
          <FieldName name={`${fieldName}:`} />
          <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary", userSelect: "none" }}>
            {"{ }"} ({entries.length} {entries.length === 1 ? "field"
              : "fields"})
          </Typography>
          <ChevronRightIcon
            fontSize="small" sx={{
              transition: 'transform 0.2s',
              transform: expand ? 'rotate(90deg)' : 'rotate(0deg)',
              color: 'text.secondary',

            }} />
        </Box>
        <TypeBadge kind="object" />
      </Box>
      <Box sx={{ borderLeft: theme => `1px solid ${theme.palette.divider}`, ml: 1, display: expand ? "block" : "none" }}>
        {entries.map(([k, v]) => (
          <ValueNode key={k} fieldName={k} value={v} level={level + 1} path={[...path, k]} />
        ))}
      </Box>

    </Box>
  );
};
