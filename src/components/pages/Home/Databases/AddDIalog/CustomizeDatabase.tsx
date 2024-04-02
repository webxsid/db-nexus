import Render from "@/components/common/Render";
import { Add, ChevronLeft, Delete } from "@mui/icons-material";
import {
  TextField,
  Box,
  Menu,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import React from "react";
import { SketchPicker } from "react-color";
import invert from "invert-color";
interface Props {
  handleNext: (dbName: string, dbColor: string) => void;
  handlePrevious: () => void;
}

const defaultColors = [
  // 10 default colors
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
];

const CustomizeDatabase: React.FC<Props> = ({ handleNext, handlePrevious }) => {
  const [dbName, setDbName] = React.useState<string>("");
  const [dbColor, setDbColor] = React.useState<string>("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      <TextField
        label="Database Name"
        variant="outlined"
        fullWidth
        required
        size="small"
        value={dbName}
        onChange={(e) => setDbName(e.target.value)}
        sx={{
          "& fieldset": {
            borderRadius: 4,
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Render
            if={dbColor !== ""}
            then={
              <IconButton
                onClick={() => setDbColor("")}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: dbColor,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Delete
                  sx={{
                    fontSize: 20,
                    color: dbColor ? invert(dbColor, true) : "#000",
                  }}
                />
              </IconButton>
            }
          />
          <Typography variant="body1">Choose Color</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {defaultColors.map((color) => (
            <Box
              key={color}
              onClick={() => setDbColor(color)}
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: color,
                cursor: "pointer",
                ...(dbColor === color && {
                  border: "2px solid #fff",
                }),
              }}
            ></Box>
          ))}
          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: "#000",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Add />
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            onClose={() => setAnchorEl(null)}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 2,
                },
              },
            }}
          >
            <SketchPicker
              disableAlpha={true}
              color={dbColor}
              onChange={(color) => setDbColor(color.hex)}
            />
          </Menu>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          alignItems: "center",
          mt: 4,
        }}
      >
        <Button
          onClick={handlePrevious}
          variant="text"
          color="primary"
          startIcon={<ChevronLeft />}
          sx={{ borderRadius: 3 }}
        >
          Back: Configure Database
        </Button>
        <Button
          onClick={() => handleNext(dbName, dbColor)}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 3 }}
        >
          Save Database
        </Button>
      </Box>
    </Box>
  );
};

export default CustomizeDatabase;
