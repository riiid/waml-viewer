import type { MouseEventHandler } from "react";
import React, { useCallback } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import Inline from "./inline";

const ButtonKnob:WAMLComponent<'ButtonKnob'> = ({ node, onClick, ...props }) => {
  const { getKnobProperty, handleKnobClick } = useWAML();
  const { activated, enabled, contentOverride } = getKnobProperty(node.index);

  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(e => {
    onClick?.(e);
    if(e.defaultPrevented) return;
    handleKnobClick(node.index);
  }, [ handleKnobClick, node.index, onClick ]);

  return <button disabled={!enabled} onClick={handleClick} {...props} data-activated={activated} data-enabled={enabled}>
    {contentOverride || node.inlines.map((v, i) => <Inline key={i} node={v} />)}
  </button>;
};
ButtonKnob.displayName = "ButtonKnob";
export default componentify(ButtonKnob);