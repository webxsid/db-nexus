import { Checkbox, MenuItem } from "@mui/material";
import { ESupportedDatabases } from "@shared";
import * as React from "react";
import ShowDBProvider from "../ShowDBProvider";
import StyledMenu from "../StyledMenu";

export interface IDBProviderSelectorProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  selectedProviders: ESupportedDatabases[];
  setSelectedProviders: React.Dispatch<
    React.SetStateAction<ESupportedDatabases[]>
  >;
}
export const DBProviderSelector: React.FC<IDBProviderSelectorProps> = ({
  selectedProviders,
  setSelectedProviders,
  open,
  onClose,
  anchorEl,
}) => {
  return (
    <StyledMenu
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
    >
      {Object.values(ESupportedDatabases).map((provider) => (
        <MenuItem
          key={provider}
          onClick={() => {
            if (selectedProviders.includes(provider)) {
              setSelectedProviders(
                selectedProviders.filter((p) => p !== provider),
              );
            } else {
              setSelectedProviders([...selectedProviders, provider]);
            }
          }}
          selected={selectedProviders.includes(provider)}
          sx={{
            "&.Mui-selected": {
              backgroundColor: "transparent",
              color: "primary.contrastText",
            },
            gap: 1,
          }}
        >
          <Checkbox
            checked={selectedProviders.includes(provider)}
            sx={{ py: 0.5 }}
          />
          <ShowDBProvider
            provider={provider}
            showName={true}
            textVariant="body1"
            textComponent={"span"}
          />
        </MenuItem>
      ))}
    </StyledMenu>
  );
};
