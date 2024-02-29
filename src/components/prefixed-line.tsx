import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import componentify from "../componentify";
import { C } from "../react";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import IsoprefixedLineGroupRenderer from "./isoprefixed-line-group-renderer";

const PrefixedLine:WAMLComponent<'PrefixedLine'> = ({ node, type, depth, className, ...props }) => {
  const $ = useRef<HTMLDivElement>(null);
  const { renderingVariables, commonOptions } = useWAML();
  const [ hasButtonBlank, setHasButtonBlank ] = useState(false);

  const pendingClassName = useMemo(() => {
    let R = renderingVariables.pendingClasses.pop();

    if(R && commonOptions.prefixedLineClassMap?.[R]){
      R = commonOptions.prefixedLineClassMap[R];
    }
    return R;
  }, [ commonOptions.prefixedLineClassMap, renderingVariables.pendingClasses ]);

  useLayoutEffect(() => {
    if($.current?.querySelector(".ButtonBlank")){
      setHasButtonBlank(true);
    }
  }, []);

  return (
    <div ref={$} className={C(className, type, pendingClassName)} {...props} {...hasButtonBlank ? { 'data-has-button-blank': true } : {}}>
      <IsoprefixedLineGroupRenderer depth={depth} lines={node} />
    </div>
  );
};
PrefixedLine.displayName = "PrefixedLine";
export default componentify(PrefixedLine);