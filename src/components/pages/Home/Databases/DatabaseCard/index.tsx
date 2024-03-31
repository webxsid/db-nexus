import React from "react";
import timeAgo from "@/helpers/text/timesAgo";
import {
  ContentCopy,
  Delete,
  Edit,
  Event,
  AccessTime,
  Cancel,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { databaseActions } from "@/store/actions";
import { SupportedDatabases } from "@/components/common/types";
import invert from "invert-color";
import { initConnection, connect as connectToDB } from "@/utils/database";
import { GetArrayReturnType } from "@/helpers/types";
import { Databases } from "@/store/types";
import { useNavigate } from "react-router";

interface Props {
  db: GetArrayReturnType<Databases>;
  openDeleteDialog: (
    id: string,
    name: string,
    provider: SupportedDatabases
  ) => void;
}
const DBCard: React.FC<Props> = ({ db, openDeleteDialog }) => {
  const { id, name, color, uri, provider, icon, createdAt, lastConnectionAt } =
    db;
  const [mouseHover, setMouseHover] = React.useState<boolean>(false);
  const [state, setState] = React.useState<{
    text: string;
    icon: React.ReactNode;
  } | null>(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openDeleteDialog(id, name, provider);
  };
  const connect = async () => {
    try {
      setState({
        text: "Initializing connection...",
        icon: <CircularProgress size={10} />,
      });
      const windowId = await initConnection(provider)(db);
      console.log("Window ID: ", windowId);
      setState((prev) => ({
        text: "Connecting...",
        icon: prev?.icon,
      }));
      const isConnected = await connectToDB(provider)();
      dispatch(
        databaseActions.updateDatabase(provider)({
          id,
          lastConnectionAt: Date.now(),
        })
      );
      if (isConnected) {
        setState(null);
        navigate(`/database/${provider}/databases`);
      } else {
        throw new Error("Failed to connect");
      }
    } catch (e) {
      console.error(e);
      setState({
        text: "Failed to connect",
        icon: <Cancel />,
      });
      setTimeout(() => {
        setState(null);
      }, 3000);
    }
  };
  return (
    <Box
      sx={{
        px: 2,
        pt: 1,
        pb: 2,
        minHeight: mouseHover ? "7rem" : "5rem",
        borderRadius: 3,
        backgroundColor: "background.paper",
        borderBottom: 3,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
      onClick={connect}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 2,
        }}
      >
        {icon ? (
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 1,
              backgroundColor: color ? color : "primary.main",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: 30,
            }}
          >
            {icon}
          </Box>
        ) : null}
        {name ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" color="primary">
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {uri}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" color="primary" noWrap>
            {uri}
          </Typography>
        )}
      </Box>
      {createdAt || lastConnectionAt ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 2,
          }}
        >
          {createdAt ? (
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
              <Event
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {timeAgo(createdAt)}
              </Typography>
            </Box>
          ) : null}
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <AccessTime
              sx={{
                color: "text.secondary",
                fontSize: "0.9rem",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {timeAgo(lastConnectionAt ?? null)}
            </Typography>
          </Box>
        </Box>
      ) : null}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.paper",
          gap: 0.7,
          p: 0.5,
          opacity: mouseHover ? 1 : 0,
        }}
      >
        <IconButton
          color="secondary"
          size="small"
          onClick={() => console.log("Edit")}
        >
          <Edit fontSize="0.7" />
        </IconButton>
        <IconButton
          color="info"
          size="small"
          onClick={() => console.log("Duplicate")}
        >
          <ContentCopy fontSize="0.7" />
        </IconButton>
        <IconButton color="error" size="small" onClick={handleDelete}>
          <Delete fontSize="0.7" />
        </IconButton>
      </Box>
      <Box
        sx={{
          backgroundColor: color ? color : "background.paper",
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          minHeight: 5,
        }}
      >
        {state ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              color: invert(
                color ? color : theme.palette.background.paper,
                true
              ),
              fontSize: "0.8rem",
              padding: 0.5,
            }}
          >
            {React.cloneElement(state.icon, {
              sx: {
                color: "inherit",
              },
            })}
            <Typography variant="caption">{state.text}</Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default DBCard;
