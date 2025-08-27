import { Typography } from "@mui/material";
import { FC } from "react";

export interface IFieldNameProps {
  name: string;
}

export const FieldName: FC<IFieldNameProps> = ({ name }) => {
  return (
    <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.primary", fontWeight: 'bold' }}>
      {name}
    </Typography>
  )
}
