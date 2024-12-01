import { styled } from "@mui/material";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Moment } from "moment";
import React, { FC } from "react";

export interface ICustomPickerDayProps extends PickersDayProps<Moment> {
  isSelected: boolean;
  isHovered: boolean;
  isStartDate: boolean;
  isEndDate: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "isSelected" &&
    prop !== "isHovered" &&
    prop !== "isEndDate" &&
    prop !== "isStartDate",
})<ICustomPickerDayProps>(
  ({ theme, isSelected, isHovered, isEndDate, isStartDate, day }) => ({
    borderRadius: "50%",
    ...(isSelected && {
      backgroundColor: `${theme.palette.primary.main}aa`,
      color: theme.palette.primary.contrastText,
      "&:hover, &:focus": {
        backgroundColor: theme.palette.primary.main,
      },
    }),
    ...(isHovered && {
      backgroundColor: `${theme.palette.primary.dark}`,
      color: theme.palette.primary.contrastText,
      "&:hover, &:focus": {
        backgroundColor: `${theme.palette.primary.light}`,
      },
    }),
    ...(day.isSame(new Date(), "day") && {
      backgroundColor: `${theme.palette.primary.main}20`,
    }),
    ...(isEndDate && {
      backgroundColor: `${theme.palette.primary.main}`,
    }),
    ...(isStartDate && {
      backgroundColor: `${theme.palette.primary.main}`,
    }),
  }),
) as React.ComponentType<ICustomPickerDayProps>;

const isInBetween = (
  day: Moment,
  startDate?: Moment | null,
  endDate?: Moment | null,
): boolean => {
  if (!startDate || !endDate) return false;
  return day.isBetween(startDate, endDate, "day", "[]");
};

function Day(
  props: PickersDayProps<Moment> & {
    selectedDay?: Moment | null;
    hoveredDay?: Moment | null;
    startDate?: Moment | null;
    endDate?: Moment | null;
  },
): React.JSX.Element {
  const { day, hoveredDay, endDate, startDate, ...other } = props;
  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2 }}
      disableMargin
      selected={false}
      isSelected={isInBetween(day, startDate, endDate)}
      isHovered={isInBetween(day, startDate, hoveredDay)}
      isStartDate={day.isSame(startDate, "day")}
      isEndDate={day.isSame(endDate, "day")}
    />
  );
}

export interface IDateRangeCalendarProps {
  startDate: Moment | null;
  endDate: Moment | null;
  setDate: (date: Moment | null) => void;
}
export const DateRangeCalendar: FC<IDateRangeCalendarProps> = ({
  startDate,
  endDate,
  setDate,
}) => {
  const [hoveredDay, setHoveredDay] = React.useState<Moment | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Moment | null>(null);

  return (
    <DateCalendar
      value={selectedDate}
      onChange={(newDate) => {
        console.log(newDate);
        setSelectedDate(newDate);
        setDate(newDate);
      }}
      disableFuture
      showDaysOutsideCurrentMonth
      slots={{ day: Day }}
      slotProps={{
        day(ownerState) {
          return {
            selectedDay: selectedDate,
            hoveredDay,
            startDate: startDate,
            endDate: endDate,
            onPointerEnter: () => setHoveredDay(ownerState.day),
            onPointerLeave: () => setHoveredDay(null),
          };
        },
      }}
    />
  );
};
