import { FC, useState } from "react";
import { Box, darken, Typography } from "@mui/material";
import { FieldRenderer } from "./Field.Renderer";
import { ChevronRight, ExpandMore } from "@mui/icons-material";

export interface IObjectRendererProps {
  fieldName: string;
  obj: object;
  level: number;
  path: string[];
}
export const ObjectRenderer: FC<IObjectRendererProps> = ({ fieldName, obj, level, path }) => {

  const [expanded, setExpanded] = useState(false);

  const ExpandIcon = expanded ? ExpandMore : ChevronRight;

  const toggleExpand = (): void => {
    setExpanded(!expanded);
  };

  if (level === 0) {
    return (
      <Box
        className="object-renderer"
        data-testid={`object-renderer-${fieldName}`}
        sx={{
          paddingLeft: 0,
          paddingBottom: 1,
        }}
      >
        <Box>
          {
            Object.entries(obj).map(([key, value]) => (
              <FieldRenderer
                key={`${path.join(".")}.${key}`}
                fieldName={key}
                fieldValue={value}
                level={level + 1}
                path={[...path, key]}
              />
            ))
          }
        </Box>

      </Box>
    );
  }

  return (
    <Box
      className="object-renderer"
      data-testid={`object-renderer-${fieldName}-${level}`}
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
            cursor: "pointer",
            userSelect: "none",
            gap: 1,
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
            color: "text.secondary"
          }}>
            {`Object [${Object.keys(obj).length}]`}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{
          whiteSpace: "nowrap",
          color: (theme) => darken(theme.palette.text.secondary, 0.6)
        }}>
          Object
        </Typography>
      </Box>
      {expanded && (
        <Box sx={{
          borderLeft: "1px solid",
          borderColor: "divider",
        }}>
          {
            Object.entries(obj).map(([key, value]) => (
              <FieldRenderer
                key={`${path.join(".")}.${key}`}
                fieldName={key}
                fieldValue={value}
                level={level + 1}
                path={[...path, key]}
              />
            ))
          }
        </Box>
      )}
    </Box>
  );
};
