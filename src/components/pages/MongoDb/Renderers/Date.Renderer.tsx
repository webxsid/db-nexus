import { FC, useMemo, useState } from "react";
import { alpha, Box, darken, lighten, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { timezoneConversaionEnabledAtom, userDateFormatAtom, userTimezoneAtom } from "@/store";
import moment from "moment-timezone";
import { SettingsApplications } from "@mui/icons-material";
import { FieldNameRenderer } from "./FieldName.Renderer";
import { FieldValueRenderer } from "./FieldValue.Renderer";
import { FieldTypeRenderer } from "./FieldType.Renderer";

export interface IDateRendererProps {
  fieldName: string;
  value: string;
  level: number;
}

export const DateRenderer: FC<IDateRendererProps> = ({ fieldName, value, level }) => {
  const [displayStyle, setDisplayStyle] = useState<"Raw" | "Formatted">("Formatted");
  const [displayTimezone, setDisplayTimezone] = useState<"Original" | "UTC" | "User">("Original");
  const [displayFormattingOptions, setDisplayFormattingOptions] = useState<boolean>(false);

  const dateFormat = useAtomValue(userDateFormatAtom);
  const userTimezone = useAtomValue(userTimezoneAtom);
  const tzEnabled = useAtomValue(timezoneConversaionEnabledAtom);

  const {
    isValid,
    displayText,
    tooltipText,
  } = useMemo(() => {
    // Strict ISO check
    const isISO = moment(value, moment.ISO_8601, true).isValid();

    // Use parseZone to preserve whatever zone the input string has (e.g. "Z", "+05:30")
    const mOriginal = isISO ? moment.parseZone(value) : moment(value);

    if (!mOriginal.isValid()) {
      return {
        isValid: false,
        displayText: JSON.stringify(value, null, 2),
        tooltipText: undefined as string | undefined,
        timezoneLabel: undefined as string | undefined,
      };
    }

    // Raw = show the exact string you got (no transform)
    if (displayStyle === "Raw") {
      return {
        isValid: true,
        displayText: String(value),
        tooltipText: `Parsed (UTC): ${mOriginal.clone().utc().toISOString()}`,
        timezoneLabel: undefined,
      };
    }

    // Formatted flow
    let mForDisplay = mOriginal.clone();

    if (displayTimezone === "UTC") {
      mForDisplay = mForDisplay.utc(); // hard UTC
    } else if (displayTimezone === "User" && tzEnabled && userTimezone) {
      mForDisplay = mForDisplay.tz(userTimezone); // convert to user's tz
    } // "Original" => keep mOriginal zone as parsed (Z stays Z)

    const shown = mForDisplay.format(dateFormat);
    const tooltip = `Original (as given): ${String(value)}\nParsed (UTC): ${mOriginal.clone().utc().toISOString()}`;

    return {
      isValid: true,
      displayText: shown,
      tooltipText: tooltip,
    };
  }, [value, dateFormat, displayStyle, displayTimezone, tzEnabled, userTimezone]);
  const timezoneDisabled = displayStyle === "Raw" || !isValid;
  const userTzOptionDisabled = !tzEnabled || !userTimezone;


  return (
    <Box
      className="date-renderer"
      data-testid={`date-renderer-${fieldName}`}
      sx={{
        paddingLeft: level === 2 ? 0 : 1,
        paddingBottom: level === 0 ? 1 : 0,
        position: "relative",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <Box sx={{ width: "100%", mb: 0.5, display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FieldNameRenderer
            fieldName={fieldName}
          />

          {isValid ? (
            <Tooltip title={tooltipText} arrow placement="top">
              <FieldValueRenderer
                value={displayText}
                formatValue={(value) => (
                  `<span class="date-color">${value}</span>`
                )}
              />
            </Tooltip>
          ) : (
            <FieldValueRenderer
              value={displayText}
              formatValue={(value) => (
                `<span class="date-color">${value}</span>`
              )}
            />
          )}
          <SettingsApplications
            role="button"
            onClick={() => setDisplayFormattingOptions((prev) => !prev)}
            aria-label="date formatting options"
            fontSize="small"
            sx={{
              cursor: "pointer",
              color: "text.secondary",
              "&:hover": {
                color: "text.primary"
              }
            }} />
        </Box>
        <FieldTypeRenderer
          type="date"
        />
      </Box>

      {/* Context actions: style + timezone switchers */}
      <Box className="date-context-actions" sx={{
        display: displayFormattingOptions ? "flex" : "none",
        gap: 1,
        alignItems: "center",
        mb: 1
      }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={displayStyle}
          onChange={(_, v) => v && setDisplayStyle(v)}
          aria-label="date display style"
          sx={{
            "& button": {
              py: 0
            }
          }}
        >
          <ToggleButton value="Raw" aria-label="raw">Raw</ToggleButton>
          <ToggleButton value="Formatted" aria-label="formatted">Fmt</ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={displayTimezone}
          onChange={(_, v) => v && setDisplayTimezone(v)}
          aria-label="timezone display"
          sx={{
            display: timezoneDisabled ? "none" : "inline-flex",
            "& button": {
              py: 0
            }
          }}

        >
          <ToggleButton value="Original" aria-label="original">Orig</ToggleButton>
          <ToggleButton value="UTC" aria-label="utc">UTC</ToggleButton>
          <ToggleButton value="User" aria-label="user" disabled={userTzOptionDisabled}>
            User
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};
