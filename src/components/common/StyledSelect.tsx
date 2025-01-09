import React, { ReactElement } from "react";
import { useTheme, Select, Box, Chip, SelectProps } from "@mui/material";

interface IStyledSelectProps {
  value: string | string[];
  multiple?: boolean;
  onChange?: SelectProps["onChange"];
  children: React.ReactNode;
  label?: string;
  labelId?: string;
  input?: ReactElement;
  size?: "small" | "medium";
  fullWidth?: boolean;
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
}) => {
  const theme = useTheme();
  return (
    <Select
      value={value}
      {...(onChange && { onChange })}
      {...(fullWidth && { fullWidth: true })}
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
