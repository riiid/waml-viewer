import { hasKind } from "@riiid/waml";
import React from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import LineComponent from "./line-component";

const Line:WAMLComponent<'Line'> = ({ node, next, ...props }) => {
  const { renderingVariables } = useWAML();

  if(node.component){
    if(hasKind(node.component, 'Anchor')){
      return null;
    }
    if(hasKind(node.component, 'ClassedBlock')){
      renderingVariables.pendingClasses.push(node.component.name);
      return null;
    }
  }
  if(node.component && hasKind(node.component, 'LineComponent') && node.component.headOption){
    return <LineComponent node={node.component} />;
  }
  const anchored = next?.component && hasKind(next.component, 'Anchor');

  return <div {...props} {...anchored ? { 'data-anchored': true } : {}}>
    <LineComponent node={node.component} />
    {anchored && <LineComponent node={next.component} />}
  </div>;
};
Line.displayName = "Line";
export default componentify(Line);