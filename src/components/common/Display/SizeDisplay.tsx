import React, { FC } from "react";

export interface ISizeDisplayProps {
  size: number; // Size in bytes
  unit?: "auto" | "Kib" | "Mib" | "Gib"; // Unit of measurement
};

export const SizeDisplay: FC<ISizeDisplayProps> = ({ size, unit = "auto" }) => {
  // Conversion factors
  const UNITS = ["B", "Kib", "Mib", "Gib"];
  const FACTOR = 1024;

  const formatSize = (size: number, unit: string): string => {
    return `${size.toFixed(2)} ${unit}`;
  };

  const calculateSize = (): string => {
    if (unit !== "auto") {
      const index = UNITS.indexOf(unit);
      if (index === -1) return formatSize(size, "B");
      return formatSize(size / Math.pow(FACTOR, index), unit);
    }

    let currentUnitIndex = 0;
    let currentSize = size;

    while (currentSize >= FACTOR && currentUnitIndex < UNITS.length - 1) {
      currentSize /= FACTOR;
      currentUnitIndex++;
    }

    return formatSize(currentSize, UNITS[currentUnitIndex]);
  };

  return <span>{calculateSize()}</span>;
};
