import { Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { FC } from "react";

export interface IFieldNameRendererProps {
  fieldName: string;
  sx?: SxProps
}
export const FieldNameRenderer: FC<IFieldNameRendererProps> = ({ fieldName, sx }) => {
  return (
    <Typography
      variant="body2"
      component="span"
      className="field-name-renderer"
      data-testid={`field-name-renderer-${fieldName}`}
      sx={{ fontWeight: "bold", ...sx }}
    >
      {fieldName}:
    </Typography>
  );
};
