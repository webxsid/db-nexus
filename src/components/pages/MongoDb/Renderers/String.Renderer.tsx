import { FC } from "react";
import { Box, } from "@mui/material";
import { FieldTypeRenderer } from "./FieldType.Renderer";
import { FieldNameRenderer } from "./FieldName.Renderer";
import { FieldValueRenderer } from "./FieldValue.Renderer";

export interface IStringRendererProps {
  fieldName: string;
  value: string;
  level: number;
}

export const StringRenderer: FC<IStringRendererProps> = ({ fieldName, value, level }) => {
  return (
    <Box
      className="string-renderer"
      data-testid={`string-renderer-${fieldName}`}
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
        <Box sx={{ flex: 1, marginBottom: 0.5, display: "flex", gap: 1, }}>
          <FieldNameRenderer fieldName={fieldName} />
          <FieldValueRenderer
            value={value}
            formatValue={(value) => `<span class="string-color">"${value}"</span>`}
          />
        </Box>
        <FieldTypeRenderer
          type="string"
        />
      </Box>
    </Box>
  );
};
