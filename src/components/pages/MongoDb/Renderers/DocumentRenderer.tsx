import { FC, useCallback, useEffect, } from "react";
import { alpha, Box, IconButton, Tooltip } from "@mui/material";
import { ValueNode } from "./ValueNode";
import { parseEjsonToJson } from "@/utils";
import { toast } from "react-toastify";
import { CopyAll } from "@mui/icons-material";
import { useSetAtom } from "jotai";
import { setMongoCollectionTabStateSelectedDocument } from "@/store";

export interface IDocumentRendererProps {
  document: object // ejson object
  docIndex: number
  selected?: boolean
}

export const DocumentRenderer: FC<IDocumentRendererProps> = ({
  document: doc,
  docIndex,
  selected = false
}) => {

  const setSelectedDocument = useSetAtom(setMongoCollectionTabStateSelectedDocument)
  const handleSelectDocument = () => {
    if (docIndex !== undefined) {
      setSelectedDocument(docIndex);
    }
  }
  const copyDocumentJson = (): void => {
    const parsedJson = parseEjsonToJson(doc);
    navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2));
    toast("Document JSON copied to clipboard", { type: "success", closeButton: false });
  }

  const scrollDocumentIntoView = useCallback(function handleScrollDocumentIntoView() {
    if (selected) {
      const element = document.getElementById(`document-${docIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [docIndex, selected]);

  useEffect(() => {
    scrollDocumentIntoView();
  }, [scrollDocumentIntoView]);

  return (
    <Box
      id={`document-${docIndex}`}
      sx={{
        maxHeight: "calc(100% - 50px)",
        px: 1, py: 2, borderRadius: 3,
        backgroundColor: (t) => alpha(t.palette.primary.main, 0.05),
        overflowWrap: "break-word", whiteSpace: "pre-wrap",
        fontFamily: "monospace", minWidth: 400,
        width: "100%",
        position: "relative",
        "& .document-actions": {
          visibility: "hidden"
        },
        "&:hover .document-actions": {
          visibility: "visible"
        },
      }}
    >
      <ValueNode fieldName={""} value={doc} level={0} path={[]} />

      <Box
        className="document-actions"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          py: 0.75, px: 1.5,
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: (t) => alpha(t.palette.primary.dark, 0.4),
          borderRadius: 3,
          borderTopLeftRadius: 0,
          borderBottomRightRadius: 0,
          backdropFilter: "blur(10px)"
        }}>
        <Tooltip title="Copy JSON" placement="top">
          <IconButton
            onClick={copyDocumentJson}
            sx={{
              p: 0,
              "& svg": { fontSize: 16 }
            }}
          >
            <CopyAll fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
