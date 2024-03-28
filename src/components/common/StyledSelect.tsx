import React from "react";
import { useTheme, Select, Box, Chip } from "@mui/material";

interface Props {
  value: string;
  multiple?: boolean;
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
  children: React.ReactNode;
  label?: string;
  labelId?: string;
  input?: React.ReactNode;
  size?: "small" | "medium";
}
const StyledSelect: React.FC<Props> = ({
  value,
  onChange,
  children,
  multiple,
  label,
  labelId,
  input,
  size = "small",
}) => {
  const theme = useTheme();
  return (
    <Select
      value={value}
      onChange={onChange}
      fullWidth
      {...(labelId && { labelId })}
      {...(label && { label })}
      {...(input && { input })}
      multiple={multiple}
      size={size}
      {...(multiple && {
        renderValue: (selected) => {
          return (
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {(selected as string[]).map((value) => (
                <Chip key={value} label={value} sx={{ m: 0.5 }} />
              ))}
            </Box>
          );
        },
      })}
      sx={{
        borderRadius: 3,
        "& .MuiPaper-root": {
          backgroundColor: `${theme.palette.background.paper}cc`,
        },
        "& legend": {
          color: theme.palette.text.primary,
        },
      }}
      MenuProps={{
        slotProps: {
          paper: {
            sx: {
              backgroundColor: `${theme.palette.background.default}33`,
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              mt: 1,
            },
          },
        },
      }}
    >
      {children}
    </Select>
  );
};

export default StyledSelect;
