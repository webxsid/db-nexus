import React from "react";

interface RenderProps {
  if: boolean | (() => boolean);
  then: React.ReactNode;
  else?: React.ReactNode;
}
const Render: React.FC<RenderProps> = ({
  if: condition,
  then,
  else: otherwise,
}) => {
  let conditionValue: boolean = false;
  if (typeof condition === "function") {
    conditionValue = condition();
  } else {
    conditionValue = condition;
  }
  if (conditionValue) {
    return <>{then}</>;
  } else if (otherwise) {
    return <>{otherwise}</>;
  }

  return null;
};

export default Render;
