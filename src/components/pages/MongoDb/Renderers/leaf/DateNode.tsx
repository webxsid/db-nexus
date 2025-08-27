import { FC, useMemo, useState } from "react";
import { Box, Tooltip, ToggleButtonGroup, ToggleButton, Typography, IconButton } from "@mui/material";
import type { TRendererProps } from "../Registry";
import moment from "moment-timezone";
import { useAtomValue } from "jotai";
import { timezoneConversaionEnabledAtom, userDateFormatAtom, userTimezoneAtom } from "@/store";
import { FieldName } from "../FieldName";
import { SettingsApplications } from "@mui/icons-material";
import { usePopper } from "@/hooks";

export type TDateStyle = "Raw" | "Formatted";
export type TDateTz = "Original" | "UTC" | "User";

interface IDateStyleConfigProps {
  style: TDateStyle;
  setStyle: (style: TDateStyle) => void;
  tz: TDateTz;
  setTz: (tz: TDateTz) => void;
  tzEnabled: boolean;
  userTz?: string;
}
const DateStyleConfig: FC<IDateStyleConfigProps> = ({ style, setStyle, tz, setTz, tzEnabled, userTz }) => {
  const { hidePopper } = usePopper();
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <ToggleButtonGroup exclusive size="small" value={style} onChange={
        (_, v) => {
          if (v) {
            setStyle(v);
            if (v === "Raw") setTz("Original");
          }
          hidePopper();
        }
      } aria-label="date style">
        <ToggleButton value="Raw">Raw</ToggleButton>
        <ToggleButton value="Formatted">Fmt</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        exclusive size="small"
        value={tz}
        onChange={(_, v) => {
          if (v) setTz(v);
          hidePopper();
        }}
        aria-label="timezone" disabled={style === "Raw"}
      >
        <ToggleButton value="Original">Orig</ToggleButton>
        <ToggleButton value="UTC">UTC</ToggleButton>
        <ToggleButton value="User" disabled={!tzEnabled || !userTz}>User</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
export const DateNode: FC<TRendererProps> = ({ fieldName, norm }) => {
  const dateFormat = useAtomValue(userDateFormatAtom);
  const userTz = useAtomValue(userTimezoneAtom);
  const tzEnabled = useAtomValue(timezoneConversaionEnabledAtom);

  const [style, setStyle] = useState<"Raw" | "Formatted">("Formatted");
  const [tz, setTz] = useState<"Original" | "UTC" | "User">("Original");

  const { showPopper } = usePopper();

  const { text, tip, tzLabel } = useMemo(() => {
    const raw = norm.value; // ISO string or epoch ms
    const mOrig = typeof raw === "number" ? moment.utc(raw) : moment.parseZone(String(raw));
    if (!mOrig.isValid()) return { text: String(raw), tip: undefined, tzLabel: undefined };

    if (style === "Raw") {
      return {
        text: mOrig.clone().toISOString(),
        tip: `Parsed (UTC): ${mOrig.clone().utc().toISOString()}`,
        tzLabel: undefined
      };
    }

    let mDisp = mOrig.clone();
    if (tz === "UTC") mDisp = mDisp.utc();
    else if (tz === "User" && tzEnabled && userTz) mDisp = mDisp.tz(userTz);

    return {
      text: mDisp.format(dateFormat),
      tip: `Original: ${String(raw)}\nUTC: ${mOrig.clone().utc().toISOString()}`,
      tzLabel: tz === "UTC" ? "UTC" : (tz === "User" && tzEnabled && userTz) ? userTz : mOrig.format("Z")
    };
  }, [norm.value, dateFormat, tzEnabled, userTz, style, tz]);

  const opemConfigPopper = (e: MouseEvent, acnhorToPointer = false): void => {
    if (!(e.currentTarget instanceof HTMLElement)) return;
    e.stopPropagation();
    e.preventDefault();
    let target = e.currentTarget;
    if (acnhorToPointer) {
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (range?.startContainer.parentElement) target = range.startContainer.parentElement as HTMLElement;
    }
    showPopper(
      target,
      {
        content: (
          <DateStyleConfig
            style={style} setStyle={setStyle}
            tz={tz} setTz={setTz}
            tzEnabled={tzEnabled} userTz={userTz}
          />
        ),
        placement: "bottom-end",
      });
  }

  return (
    <Box sx={{
      width: "100%",
      overflowX: "auto",
      display: "flex",
      gap: 1,
      alignItems: "center",
      "& .hover-actions": { visibility: "hidden" },
      "&:hover .hover-actions": { visibility: "visible" }
    }}
      onContextMenu={(e) => opemConfigPopper(e as unknown as MouseEvent, true)}
    >
      <FieldName name={`${fieldName}:`} />
      <Tooltip title={tip ?? ""} placement="top" arrow disableHoverListener={!tip}>
        <Typography variant="body2" sx={{ color: "text.secondary", fontFamily: "monospace", cursor: tip ? "help" : "default" }}>
          {text}{tzLabel ? <Typography component="span" variant="caption" sx={{ ml: .5, opacity: .7 }}>({tzLabel})</Typography> : null}
        </Typography>
      </Tooltip>
      <IconButton
        onClick={(e) => opemConfigPopper(e as unknown as MouseEvent)}
        className="hover-actions"
        sx={{
          p: 0,
          userSelect: "none",
          "& svg": {
            verticalAlign: "middle",
            color: "action.active",
            opacity: .5
          }
        }}
        size="small"
      >
        <SettingsApplications fontSize="small" />
      </IconButton>
    </Box>
  );
};
