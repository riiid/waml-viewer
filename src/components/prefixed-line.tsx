import React from "react";
import componentify from "../componentify";
import { C } from "../react";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import IsoprefixedLineGroupRenderer from "./isoprefixed-line-group-renderer";

const PrefixedLine:WAMLComponent<'PrefixedLine'> = ({ node, type, depth, className, ...props }) => {
  const { renderingVariables } = useWAML();

  return (
    <div className={C(className, type, renderingVariables.pendingClasses.pop())} {...props}>
      <IsoprefixedLineGroupRenderer depth={depth} lines={node} />
    </div>
  );
};
PrefixedLine.displayName = "PrefixedLine";
export default componentify(PrefixedLine);