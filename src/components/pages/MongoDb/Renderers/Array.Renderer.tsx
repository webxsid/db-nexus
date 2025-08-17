import { FC, useState } from "react";
import { Box, darken, Typography } from "@mui/material";
import { FieldRenderer } from "./Field.Renderer";
import { ChevronRight, Expand, ExpandMore, More } from "@mui/icons-material";
import { FieldNameRenderer } from "./FieldName.Renderer";
import { FieldValueRenderer } from "./FieldValue.Renderer";
import { FieldTypeRenderer } from "./FieldType.Renderer";

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
            pl: expanded ? 1 : 0,
          }}
          onClick={toggleExpand}
        >
          <ExpandIcon sx={{
            transform: "translateY(-50%)",
            color: "text.secondary",
            position: "absolute",
            left: -12,
            top: "50%",
            width: "0.9rem",
            height: "0.9rem",
          }} />
          <FieldNameRenderer
            fieldName={fieldName}
          />
          <FieldValueRenderer
            value={`${array.length} items`}
            formatValue={(value) => (
              `<span class="array-color">${value}</span>`
            )}
          />
        </Box>
        <FieldTypeRenderer
          type="array"
        />
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
