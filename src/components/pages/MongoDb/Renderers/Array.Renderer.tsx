import { FC, useState } from "react";
import { Box, darken, Typography } from "@mui/material";
import { FieldRenderer } from "./Field.Renderer";
import { ChevronRight, Expand, ExpandMore, More } from "@mui/icons-material";

export interface IArrayRendererProps {
  fieldName: string;
  array: unknown[];
  level: number;
  path: string[];
}

export const ArrayRenderer: FC<IArrayRendererProps> = ({ fieldName, array, level, path }) => {
  const [expanded, setExpanded] = useState(false);

  const ExpandIcon = expanded ? ExpandMore : ChevronRight;

  const toggleExpand = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Box
      className="array-renderer"
      data-testid={`array-renderer-${fieldName}-${level}`}
      sx={{
        paddingLeft: level === 2 ? 0 : 1,
        paddingBottom: level === 0 ? 1 : 0,
        width: "100%",
      }}>
      <Box sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            userSelect: "none",
            position: "relative",
          }}
          onClick={toggleExpand}
        >
          <ExpandIcon sx={{
            transform: "translateY(-50%)",
            color: "text.secondary",
            position: "absolute",
            left: -15,
            top: "50%",
            width: "0.9rem",
            height: "0.9rem",
          }} />
          <Typography variant="body2" component="span" sx={{ fontWeight: "bold" }}>
            {fieldName}:
          </Typography>

          <Typography variant="body2" component="span" sx={{
            color: "text.secondary",
          }}>
            {`Array [${array.length}]`}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{
          whiteSpace: "nowrap",
          color: (theme) => darken(theme.palette.text.secondary, 0.6)
        }}>
          Array
        </Typography>
      </Box>
      {expanded && (
        <Box sx={{
          borderLeft: "1px solid",
          borderColor: "divider",
        }}>
          {array.map((item, index) => (
            <FieldRenderer
              key={`${path.join(".")}[${index}]`}
              fieldName={`${index}`}
              fieldValue={item}
              level={level + 1}
              path={[...path, index.toString()]}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
