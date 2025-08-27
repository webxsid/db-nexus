import { FC } from "react";
import { Box, Chip, Tooltip, Typography } from "@mui/material";
import type { TRendererProps } from "../Registry";
import { FieldName } from "../FieldName";
import { TMongoStringSubTypes } from "../ejson";
import { Info } from "@mui/icons-material";

export const StringNode: FC<TRendererProps> = ({ fieldName, norm }) => {
  const { value, meta } = norm as unknown as { value: string, meta?: { subType: TMongoStringSubTypes, reasons: string[] } };
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Box sx={{ width: "calc(100% - 3rem)", overflowX: "auto", display: "flex", gap: 1, alignItems: "center" }}>
        <FieldName name={`${fieldName}:`} />
        <Typography variant="body2" sx={{ fontFamily: "monospace", color: (t) => t.palette.primary.main }} noWrap>
          {JSON.stringify(value)}
        </Typography>
        {meta?.subType && (
          <Tooltip
            title={
              <Box>
                <Typography variant="subtitle2" color="textPrimary">Might be a(n) {meta.subType}</Typography>
                {meta.reasons && meta.reasons.length > 0 && (
                  <Box component="ul" sx={{ pl: 2, my: 0 }}>
                    {meta.reasons.map((reason, idx) => (
                      <li key={idx}>
                        <Typography variant="caption" color="textPrimary">{reason}</Typography>
                      </li>
                    ))}
                  </Box>
                )}
              </Box>
            }
            placement="top"
            arrow
          >
            <Chip
              icon={<Info sx={{ width: 12, height: 12 }} />}
              label={meta.subType}
              size="small"
              sx={{
                borderRadius: 4,
                fontSize: 10,
                height: "unset",
                py: 0.2,
                cursor: "help"
              }}
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  )
};
