import type { MouseEventHandler } from "react";
import React, { useCallback } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import Inline from "./inline";

const InlineKnob:WAMLComponent<'InlineKnob'> = ({ node, onClick, ...props }) => {
  const { getKnobProperty, handleKnobClick } = useWAML();
  const { activated, enabled, contentOverride } = getKnobProperty(node.index);

  const handleClick = useCallback<MouseEventHandler<HTMLLabelElement>>(e => {
    onClick?.(e);
    if(e.defaultPrevented) return;
    handleKnobClick(node.index);
  }, [ handleKnobClick, node.index, onClick ]);

  return <label onClick={handleClick} {...props} data-activated={activated} data-enabled={enabled}>
    {contentOverride || node.inlines.map((v, i) => <Inline key={i} node={v} />)}
  </label>;
};
InlineKnob.displayName = "InlineKnob";
export default componentify(InlineKnob);