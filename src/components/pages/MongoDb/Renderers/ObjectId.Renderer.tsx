import { FC } from "react";
import { Box, darken, Typography } from "@mui/material";
import { FieldNameRenderer } from "./FieldName.Renderer";
import { FieldValueRenderer } from "./FieldValue.Renderer";
import { FieldTypeRenderer } from "./FieldType.Renderer";

export interface IObjectIdRendererProps {
  fieldName: string;
  value: string;
  level: number;
}

export const ObjectIdRenderer: FC<IObjectIdRendererProps> = ({ fieldName, value, level }) => {
  return (
    <Box
      className="objectid-renderer"
      data-testid={`object-renderer-${fieldName}`}
      sx={{
        paddingLeft: 0,
        paddingBottom: level === 0 ? 1 : 0,
        position: "relative",
        width: "100%",
      }}
    >
      <Box sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Box sx={{ width: "100%", marginBottom: 0.5, display: "flex", gap: 1, }}>
          <FieldNameRenderer
            fieldName={fieldName}
          />
          <FieldValueRenderer
            value={value}
            formatValue={(value) => `<span class = "object-id-color">ObjectID(</span>"${value}"<span class = "object-id-color">)</span>`}
          />
        </Box>
        <FieldTypeRenderer
          type="objectId"
        />
      </Box>
    </Box>
  );
};
