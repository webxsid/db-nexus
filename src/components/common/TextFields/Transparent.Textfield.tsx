import { styled, TextField } from "@mui/material";

export const TransparentTextField = styled(TextField)({
  backgroundColor: "transparent",
  borderRadius: 2,
  borderColor: "currentColor",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  "& .MuiInputBase-input": {
    color: "currentColor",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiInputLabel-root": {
    color: "currentColor",
  },
  "& .MuiInputLabel-outlined": {
    transform: "translate(14px, 16px) scale(1)",
  },
  "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
    transform: "translate(14px, -6px) scale(0.75)",
  },
});
