import React from "react";

interface RenderProps {
  if: boolean | (() => boolean) | (() => Promise<boolean>);
  then: React.ReactNode;
  else?: React.ReactNode;
}
const Render: React.FC<RenderProps> = ({
  if: condition,
  then,
  else: otherwise,
}) => {
  if (typeof condition === "function") {
    condition = condition();
  }
  if (condition) {
    return <>{then}</>;
  } else if (otherwise) {
    return <>{otherwise}</>;
  }

  return null;
};

export default Render;
