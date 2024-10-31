import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import React, { FC, ReactNode, useCallback, useEffect } from "react";
import { DateRangeCalendar } from "../DateRangeCalendar";
import StyledMenu from "../StyledMenu";

export interface IDatePickerProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  selectedStartDate: Moment | null;
  selectedEndDate: Moment | null;
  setSelectedStartDate: React.Dispatch<React.SetStateAction<Moment | null>>;
  setSelectedEndDate: React.Dispatch<React.SetStateAction<Moment | null>>;
}

export const DatePicker: FC<IDatePickerProps> = ({
  selectedStartDate,
  selectedEndDate,
  setSelectedStartDate,
  setSelectedEndDate,
  open,
  onClose,
  anchorEl,
}) => {
  const [searchText, setSearchText] = React.useState<string>("");
  const [isStart, setIsStart] = React.useState<boolean>(true);
  const [showCalendar, setShowCalendar] = React.useState<boolean>(true);

  useEffect(() => {
    setShowCalendar(searchText === "");
  }, [searchText]);

  const handleDateChange = React.useCallback(
    (newDate: Moment | null, isStart: boolean): void => {
      if (selectedStartDate && selectedEndDate) {
        setSelectedStartDate(newDate);
        setSelectedEndDate(null);
      } else if (isStart) {
        setSelectedStartDate(newDate);
      } else {
        setSelectedEndDate(newDate);
      }
    },
    [
      selectedStartDate,
      selectedEndDate,
      setSelectedStartDate,
      setSelectedEndDate,
    ],
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchText(event.target.value);
  };

  const handleQuickSelect = React.useCallback(
    (
      durationStart: number,
      unitStart: moment.unitOfTime.DurationConstructor,
      durationEnd: number,
      unitEnd: moment.unitOfTime.DurationConstructor,
    ): void => {
      setSelectedStartDate(moment().subtract(durationStart, unitStart));
      setSelectedEndDate(moment().subtract(durationEnd, unitEnd));
      setSearchText(""); // Reset search text to show calendar next time
      onClose();
    },
    [setSelectedStartDate, setSelectedEndDate, onClose],
  );

  // Determine if search text is a valid date
  const isDate = React.useMemo(() => {
    const formats = ["MM/DD/YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "YYYY/MM/DD"];
    return formats.some((format) => moment(searchText, format, true).isValid());
  }, [searchText]);

  const parsedDate = React.useMemo(() => {
    const formats = ["MM/DD/YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "YYYY/MM/DD"];
    return isDate
      ? moment(
          searchText,
          formats.find((format) => moment(searchText, format, true).isValid()),
        )
      : null;
  }, [isDate, searchText]);

  const isNumeric = React.useMemo(() => /^\d+$/.test(searchText), [searchText]);

  const isYear = React.useMemo(() => {
    const year = Number(searchText);
    return year >= 2000 && year <= moment().year();
  }, [searchText]);

  const isMonth = React.useMemo(() => {
    return (
      moment(searchText, "MMMM", true).isValid() ||
      moment(searchText, "MMM", true).isValid()
    );
  }, [searchText]);

  const options = React.useMemo(() => {
    const opts: ReactNode[] = [];

    if (isDate) {
      opts.push(
        <ListItemButton
          key={`on-${parsedDate!.format("MM-DD-YYYY")}`}
          dense
          onClick={() => {
            setSelectedStartDate(parsedDate!);
            setSelectedEndDate(parsedDate!);
          }}
        >
          <ListItemText primary={`On ${parsedDate!.format("MM/DD/YYYY")}`} />
        </ListItemButton>,
        <ListItemButton
          key={`from-${parsedDate!.format("MM-DD-YYYY")}`}
          dense
          onClick={() => {
            setSelectedStartDate(parsedDate!);
            setSelectedEndDate(moment());
          }}
        >
          <ListItemText primary={`From ${parsedDate!.format("MM/DD/YYYY")}`} />
        </ListItemButton>,
      );
    }

    if (isYear) {
      opts.push(
        <ListItemButton
          key={`year-${searchText}`}
          dense
          onClick={() => {
            setSelectedStartDate(moment(`01/01/${searchText}`, "MM/DD/YYYY"));
            setSelectedEndDate(moment(`12/31/${searchText}`, "MM/DD/YYYY"));
          }}
        >
          <ListItemText primary={`In Year ${searchText}`} />
        </ListItemButton>,
      );
    }

    if (isMonth) {
      opts.push(
        <ListItemButton
          key={`month-${searchText}`}
          dense
          onClick={() => {
            const month1 = moment(searchText, "MMMM", true).month();
            const month2 = moment(searchText, "MMM", true).month();
            const month = month1 >= 0 ? month1 : month2;
            setSelectedStartDate(moment().month(month).startOf("month"));
            setSelectedEndDate(moment().month(month).endOf("month"));
          }}
        >
          <ListItemText primary={`In ${searchText} This Year`} />
        </ListItemButton>,
      );
    }

    if (isNumeric) {
      opts.push(
        <ListItemButton
          key={`last-${searchText}-days`}
          dense
          onClick={() =>
            handleQuickSelect(Number(searchText), "days", 0, "days")
          }
        >
          <ListItemText primary={`Last ${searchText} Days`} />
        </ListItemButton>,
        <ListItemButton
          key={`last-${searchText}-months`}
          dense
          onClick={() =>
            handleQuickSelect(0, "days", Number(searchText), "months")
          }
        >
          <ListItemText primary={`Last ${searchText} Months`} />
        </ListItemButton>,
        <ListItemButton
          key={`last-${searchText}-years`}
          dense
          onClick={() =>
            handleQuickSelect(0, "days", Number(searchText), "years")
          }
        >
          <ListItemText primary={`Last ${searchText} Years`} />
        </ListItemButton>,
      );
    } else {
      opts.push(
        <ListItemButton
          key="last-7-days"
          dense
          onClick={() => handleQuickSelect(7, "days", 0, "days")}
        >
          <ListItemText primary={`Last 7 Days`} />
        </ListItemButton>,
        <ListItemButton
          key="last-30-days"
          dense
          onClick={() => handleQuickSelect(30, "days", 0, "days")}
        >
          <ListItemText primary={`Last 30 Days`} />
        </ListItemButton>,
        <ListItemButton
          key="last-month"
          dense
          onClick={() => handleQuickSelect(1, "months", 0, "days")}
        >
          <ListItemText primary={`Last Month`} />
        </ListItemButton>,
        <ListItemButton
          key="last-year"
          dense
          onClick={() => handleQuickSelect(1, "years", 0, "days")}
        >
          <ListItemText primary={`Last Year`} />
        </ListItemButton>,
      );
    }

    return opts;
  }, [
    isDate,
    isYear,
    isMonth,
    isNumeric,
    parsedDate,
    setSelectedStartDate,
    searchText,
    handleQuickSelect,
    setSelectedEndDate,
  ]);

  useEffect(() => {
    setIsStart(!selectedEndDate || !!selectedStartDate);
  }, [selectedStartDate, selectedEndDate]);

  const handleArrowDown = useCallback(function arrowDownHandler() {
    // find the next li element or the first one if none is selected
    console.log("Arrow Down");
    const nextElement =
      document.activeElement?.nextElementSibling ||
      document.querySelector("li");
    if (nextElement) {
      nextElement.focus();
    }
  }, []);

  return (
    <StyledMenu
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1 }}>
        <TextField
          label="Search Date Range"
          placeholder="Type date or range"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={handleInputChange}
          fullWidth
          onKeyDown={(e) => {
            console.log(e.key);
            if (e.key === "ArrowDown") {
              e.preventDefault();
              handleArrowDown();
            }
          }}
        />
        {showCalendar ? (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateRangeCalendar
              startDate={selectedStartDate}
              endDate={selectedEndDate}
              isStart={isStart}
              setStartDate={(date) => handleDateChange(date, true)}
              setEndDate={(date) => handleDateChange(date, false)}
            />
          </LocalizationProvider>
        ) : (
          <List dense>{options}</List>
        )}
      </Box>
    </StyledMenu>
  );
};
