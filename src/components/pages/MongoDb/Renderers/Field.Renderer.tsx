import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { ArrayRenderer } from "./Array.Renderer";
import { ObjectRenderer } from "./Object.Renderer";
import { Types } from "mongoose";
import { StringRenderer } from "./String.Renderer";
import { DateRenderer } from "./Date.Renderer";
import { ObjectIdRenderer } from "./ObjectId.Renderer";

export interface IFieldRendererProps {
  fieldName: string;
  fieldValue: unknown;
  level: number;
  path: string[];
}
export const FieldRenderer: FC<IFieldRendererProps> = ({ fieldName, fieldValue, level, path }) => {

  const type = Array.isArray(fieldValue) ? "array" : typeof fieldValue;

  let stringSubType: string | null = null;

  if (type === "string") {

    if (Types.ObjectId.isValid(fieldValue as string)) {
      stringSubType = "objectId";
    } else if (new Date(fieldValue as string).toString() !== "Invalid Date") {
      stringSubType = "date";
    } else if ((fieldValue as string).startsWith("http://") || (fieldValue as string).startsWith("https://")) {
      stringSubType = "url";
    } else if ((fieldValue as string).match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
      stringSubType = "isoDate";
    } else if ((fieldValue as string).match(/^\d{4}-\d{2}-\d{2}$/)) {
      stringSubType = "dateOnly";
    } else if ((fieldValue as string).match(/^\d(24|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)) {
      stringSubType = "time";
    }
  }

  return (
    <Box
      className="field-renderer"
      data-testid={`field-renderer-${fieldName}`}
      sx={{
        paddingLeft: level === 1 ? 0 : 1,
        paddingBottom: level === 0 ? 1 : 0,
        position: "relative",
        maxWidth: "100%",
      }}
    >

      <Box sx={{ width: "100%", display: "flex", gap: 0.3, pl: 1 }}>
        {
          type === "array" ? (
            <ArrayRenderer
              fieldName={fieldName}
              array={fieldValue as unknown[]}
              level={level + 1}
              path={[...path, fieldName]}
            />
          ) : type === "object" ? (
            <ObjectRenderer
              fieldName={fieldName}
              obj={fieldValue as object}
              level={level + 1}
              path={[...path, fieldName]}
            />
          ) : type === "string" ? (
            <>
              {
                stringSubType === null ? (
                  <StringRenderer
                    fieldName={fieldName}
                    value={fieldValue as string}
                    level={level + 1}
                  />
                ) : stringSubType === "date" ? (
                  <DateRenderer
                    fieldName={fieldName}
                    value={fieldValue as string}
                    level={level + 1}
                  />
                ) : stringSubType === "objectId" ? (
                  <ObjectIdRenderer
                    fieldName={fieldName}
                    value={fieldValue as string}
                    level={level + 1}
                  />
                ) : (<>
                  <Typography variant="body2" component="span" sx={{ fontWeight: "bold", mr: 1 }}>
                    {fieldName}:
                  </Typography>
                  <Typography
                    variant="body2"
                    component="span"
                    noWrap
                    sx={{
                      fontFamily:
                        "monospace",
                      color: "text.secondary",
                    }}
                  >
                    {JSON.stringify(fieldValue, null, 2)}
                  </Typography>

                </>)
              }
            </>
          ) : (
            <>
            </>
          )
        }
      </Box>
    </Box>
  );
};
