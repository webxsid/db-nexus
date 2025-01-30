import { FC, MouseEvent, ReactNode } from "react";
import {
  MongoLeftSidebarModuleActiveAtom,
  MongoRightSidebarModuleActiveAtom,
  TMongoSidebarModule,
} from "@/store";
import { Box, IconButton, Typography } from "@mui/material";
import { usePopper } from "@/hooks";
import { useSetAtom } from "jotai";
import { Remove } from "@mui/icons-material";
import Render from "@/components/common/Render";

const HeaderActionButton: FC<{
  icon: ReactNode;
  label: string;
  onClick: (e: MouseEvent) => void;
}> = ({ icon, label, onClick }) => {

  const { showPopper, hidePopper } = usePopper();

  const onHover = (e: MouseEvent): void => {
    showPopper(e.currentTarget, {
      content: (
        <Typography
          variant={"body2"}
          component={"span"}
          color={"text.primary"}
          fontSize={"small"}
        >
          {label}
        </Typography>
      ),
    });
  };

  return (
    <IconButton
      onClick={onClick}
      size={"small"}
      sx={{
        p: 0.5,
        borderRadius: 2,
        "& svg": {
          color: "text.primary",
          opacity: 0.5,
          fontSize: "1rem",
          transition: "opacity 0.2s",
        },
        "&:hover svg": {
          opacity: 1,
        },
      }}
      onMouseEnter={onHover}
      onMouseLeave={hidePopper}
    >

      {icon}
    </IconButton>
  );
};

export interface IMongoSidebarModulePanelTemplateProps {
  label: string; // Label to display in the tooltip
  moduleKey: TMongoSidebarModule;
  side: "left" | "right";
  headerActions: Array<{
    icon: ReactNode;
    label: string;
    onClick: (e: MouseEvent) => void;
  }>;
  footer?: ReactNode;
  children?: ReactNode;
}

export const MongoSidebarModulePanelTemplate: FC<
  IMongoSidebarModulePanelTemplateProps
> = ({
  label,
  moduleKey: _moduleKey,
  side: _side,
  headerActions,
  footer,
  children,
}) => {
  const setLeftActiveModule = useSetAtom(MongoLeftSidebarModuleActiveAtom);
  const setRightActiveModule = useSetAtom(MongoRightSidebarModuleActiveAtom);

  const closePanel = (): void => {
    if (_side === "left") {
      setLeftActiveModule(null);
    } else {
      setRightActiveModule(null);
    }
  };

  return (
    <Box
      component={"aside"}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box
        component={"header"}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          p: 1,
          pl: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 40,
        }}
      >
        <Typography
          variant={"body2"}
          component={"h2"}
          color={"text.primary"}
          fontSize={"medium"}
          fontWeight={"bolder"}
        >
          {label}
        </Typography>
        <Box id={`header-actions-${label}`} sx={{ display: "flex" }}>
          {headerActions.map((action, index) => (
            <HeaderActionButton key={`${action.label}-${index}`} {...action} />
          ))}
          <HeaderActionButton
            icon={<Remove />}
            label={"Close"}
            onClick={closePanel}
          />
        </Box>
      </Box>
      <Box
        component={"section"}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height:"100%",
          gap: 1,
          px: 1,
        }}
      >
        {children}
      </Box>
      <Render
        if={!!footer}
        then={
          <Box
            component={"footer"}
            sx={{
              p: 1,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            {footer}
          </Box>
        }
      />
    </Box>
  );
};
