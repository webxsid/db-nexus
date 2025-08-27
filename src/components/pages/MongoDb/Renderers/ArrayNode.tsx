import { FC, useState } from "react";
import { Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { ValueNode } from "./ValueNode";
import type { TRendererProps } from "./Registry";
import { FieldName } from "./FieldName";
import { TypeBadge } from "./TypeBadge";

export const ArrayNode: FC<TRendererProps> = ({ fieldName, norm, level, path }) => {
  const [open, setOpen] = useState(false);
  const arr = norm.value as unknown[];

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', display: "flex", alignItems: "center", gap: 1, cursor: "pointer", userSelect: "none" }} role="button" onClick={() => setOpen(!open)}>
        <FieldName name={`${fieldName}:`} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flex: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>Array [ {arr.length} ]</Typography>
          <ChevronRightIcon fontSize="small" sx={{
            transition: 'transform 0.2s',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            color: 'text.secondary',

          }} />
        </Box>
        <TypeBadge kind="array" />
      </Box>
      <Box sx={{ width: '100%', display: open ? 'block' : 'none', borderLeft: '1px solid', borderColor: 'divider' }}>
        {open && arr.map((item, idx) => (
          <ValueNode key={idx} fieldName={String(idx)} value={item} level={level + 1} path={[...path, String(idx)]} />
        ))}
      </Box>
    </Box>
  );
};
