import React, { FC } from "react";

export interface ILargeNumDisplayProps {
  value: number;
  unit?: "auto" | "K" | "M" | "B"; // K = Thousand, M = Million, B = Billion
}

export const LargeNumberDisplay: FC<ILargeNumDisplayProps> = ({ value, unit = "auto" }) => {
  const UNITS = ["", "K", "M", "B"];
  const FACTOR = 1000;

  // Formats number to omit decimals if they're zero
  const formatNumber = (num: number, unit: string): string => {
    const formatted = num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
    return `${formatted}${unit}`;
  };

  const calculateNumber = (): string => {
    if (unit !== "auto") {
      const index = UNITS.indexOf(unit);
      if (index === -1) return formatNumber(value, ""); // Fallback for invalid unit
      return formatNumber(value / Math.pow(FACTOR, index), unit);
    }

    let currentValue = value;
    let unitIndex = 0;

    while (currentValue >= FACTOR && unitIndex < UNITS.length - 1) {
      currentValue /= FACTOR;
      unitIndex++;
    }

    return formatNumber(currentValue, UNITS[unitIndex]);
  };

  return <>{calculateNumber()}</>;
};