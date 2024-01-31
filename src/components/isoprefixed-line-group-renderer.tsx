import { WAML } from "@riiid/waml";
import type { FC } from "react";
import { Fragment, useMemo } from "react";
import Line from "./line";
import PrefixedLine from "./prefixed-line";
import React from "react";

type Props = {
  'depth'?: number,
  'lines': WAML.Line[]
};
const IsoprefixedLineGroupRenderer:FC<Props> = ({ depth = 0, lines }) => {
  const lineGroups = useMemo(() => getIsoprefixedLineGroups(lines, depth), [ depth, lines ]);

  return (
    <>
      {lineGroups.map(({ prefix, lines: sublines }, i) => {
        switch(prefix){
          case "":
            return (
              <Fragment key={i}>
                {sublines.map((w, j) => <Line key={j} node={w} next={sublines[j + 1]} />)}
              </Fragment>
            );
          case WAML.LinePrefix.QUESTION:
            return <PrefixedLine key={i} type="Question" depth={depth + 1} node={sublines} />;
          case WAML.LinePrefix.QUOTATION:
            return <PrefixedLine key={i} type="Quotation" depth={depth + 1} node={sublines} />;
          case WAML.LinePrefix.INDENTATION:
            return <PrefixedLine key={i} type="Indentation" depth={depth + 1} node={sublines} />;
          default:
            throw Error(`Unhandled prefix: ${prefix}`);
        }
      })}
    </>
  );
};
export default IsoprefixedLineGroupRenderer;

type IsoprefixedLineGroup = {
  'prefix': string,
  'lines': WAML.Line[]
};
function getIsoprefixedLineGroups(lines:WAML.Line[], depth:number = 0):IsoprefixedLineGroup[]{
  const R:IsoprefixedLineGroup[] = [];
  let currentLines:WAML.Line[] = [];
  let pivotPrefix:string|undefined;

  for(let i = 0; i < lines.length; i++){
    const prefix = lines[i].prefixes[depth]?.value || "";

    if(pivotPrefix === undefined){
      currentLines.push(lines[i]);
      pivotPrefix = prefix;
    }else if(pivotPrefix === prefix){
      currentLines.push(lines[i]);
    }else{
      R.push({ prefix: pivotPrefix, lines: [ ...currentLines ] });
      currentLines = [ lines[i] ];
      pivotPrefix = prefix;
    }
  }
  if(pivotPrefix !== undefined && currentLines.length){
    R.push({ prefix: pivotPrefix, lines: [ ...currentLines ] });
  }
  return R;
}