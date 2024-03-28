export type DestUnit = "KB" | "MB" | "GB" | "Auto";

const convertBytes = (bytes: number, destUnit: DestUnit = "Auto") => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (destUnit === "Auto") {
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  }
  const destIndex = units.indexOf(destUnit);
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[destIndex]}`;
};

export default convertBytes;
