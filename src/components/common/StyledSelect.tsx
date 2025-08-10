import React, { ReactElement } from "react";
import { Select, Box, Chip, SelectProps, alpha } from "@mui/material";

interface IStyledSelectProps {
  value: string | string[];
  multiple?: boolean;
  onChange?: SelectProps["onChange"];
  children: React.ReactNode;
  label?: string;
  labelId?: string;
  input?: ReactElement;
  size?: "smaller" | "small" | "medium";
  fullWidth?: boolean;
  sx?: SelectProps['sx'];
}
const StyledSelect: React.FC<IStyledSelectProps> = ({
  value,
  onChange,
  children,
  multiple,
  label,
  labelId,
  input,
  size = "small",
  fullWidth,
  sx
}) => {
  return (
    <Select
      value={value}
      {...(onChange && { onChange })}
      {...(fullWidth && { fullWidth: true })}
      {...(labelId && { labelId })}
      {...(label && { label })}
      {...(input && { input })}
      multiple={multiple}
      size={size === "smaller" ? "small" : size}
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
        borderRadius: 2,
        "& legend": {
          color: "text.primary",
        },
        "& .MuiSelect-select": {
          ...(size === "smaller" ? {
            py: 0.5
          } : {}),
          display: "flex",
          alignItems: "center",
          gap: 1,
        },
        ...(!!sx && sx),
      }}
      MenuProps={{
        slotProps: {
          paper: {
            sx: {
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.3),
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              color: "text.primary",
              border: 1,
              borderColor: "divider",
              mt: 1,
              "& .MuiList-root": {
                py: 0
              }
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
