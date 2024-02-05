import React, { useMemo } from "react";
import componentify from "../componentify";
import { C } from "../react";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import IsoprefixedLineGroupRenderer from "./isoprefixed-line-group-renderer";

const PrefixedLine:WAMLComponent<'PrefixedLine'> = ({ node, type, depth, className, ...props }) => {
  const { renderingVariables, commonOptions } = useWAML();
  const pendingClassName = useMemo(() => {
    const R = renderingVariables.pendingClasses.pop();

    if(R && commonOptions.prefixedLineClassMap?.[R]){
      return commonOptions.prefixedLineClassMap[R];
    }
    return R;
  }, [ commonOptions.prefixedLineClassMap, renderingVariables.pendingClasses ]);

  return (
    <div className={C(className, type, pendingClassName)} {...props}>
      <IsoprefixedLineGroupRenderer depth={depth} lines={node} />
    </div>
  );
};
PrefixedLine.displayName = "PrefixedLine";
export default componentify(PrefixedLine);