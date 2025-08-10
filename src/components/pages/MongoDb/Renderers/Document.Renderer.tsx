import { alpha, Box } from "@mui/material";
import { FC } from "react";
import { ObjectRenderer } from "./Object.Renderer";

export interface IDocumentRendererProps {
  document: object
}

export const DocumentRenderer: FC<IDocumentRendererProps> = ({ document }) => {
  return (
    <Box
      sx={{
        px: 1,
        py: 2,
        borderRadius: 3,
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap",
        fontFamily: "monospace",
        minWidth: "400px",
      }}

    >
      <ObjectRenderer
        fieldName=""
        obj={document}
        level={0}
        path={[]}
      />
    </Box>
  );
};
