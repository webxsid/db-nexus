import { alpha, Box, Button } from "@mui/material";
import { FC } from "react";
import { ObjectRenderer } from "./Object.Renderer";
import StyledChoiceButton from "@/components/common/StyledChoiceButton";

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
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Button
          variant="outlined"
          size="small"
          sx={{ mb: 1, mr: 1 }}
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(document, null, 2));
          }}
        >
          Copy Document
        </Button>
      </Box>
      <ObjectRenderer
        fieldName=""
        obj={document}
        level={0}
        path={[]}
      />
    </Box>
  );
};
