import { FC } from "react";
import { alpha, Box, IconButton, Typography } from "@mui/material";
import type { TRendererProps } from "../Registry";
import { FieldName } from "../FieldName";
import { CopyAll, OpenInNew } from "@mui/icons-material";
import { toast } from "react-toastify";

export const ObjectIdNode: FC<TRendererProps> = ({ fieldName, norm }) => {
  const id = norm.value as string;
  return (
    <Box sx={{
      width: "100%",
      overflowX: "auto",
      display: "flex",
      gap: 1,
      alignItems: "center",
      cursor: "pointer",
      "& .hover-action": {
        visibility: "hidden",
      },
      "&:hover .highlight": {
        textDecoration: "underline",
      },
      "&:hover .hover-action": {
        visibility: "visible",
      },
    }}>
      <FieldName name={`${fieldName}:`} />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontFamily: "monospace", color: (t) => alpha((t.palette.text.secondary), 0.4), userSelect: "none" }}>ObjectId(</Typography>
        <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.secondary" }} className="highlight" >{id}</Typography>
        <Typography variant="body2" sx={{ fontFamily: "monospace", color: (t) => alpha((t.palette.text.secondary), 0.4), userSelect: "none" }}>)</Typography>
      </Box>
      <IconButton className="hover-action" sx={{
        p: 0,
        "& svg": {
          color: (t) => alpha((t.palette.text.secondary), 0.4),
          fontSize: "1rem",
        }
      }} size="small" onClick={() => {
        navigator.clipboard.writeText(id);
        toast("Copied to clipboard", { type: "info", autoClose: 1000 });
      }}>
        <CopyAll fontSize="small" />
      </IconButton>
      <IconButton className="hover-action" sx={{
        p: 0,
        "& svg": {
          color: (t) => alpha((t.palette.text.secondary), 0.4),
          fontSize: "1rem",
        }
      }} size="small" onClick={() => {
      }}>
        <OpenInNew fontSize="small" />
      </IconButton>
    </Box>
  );
};
