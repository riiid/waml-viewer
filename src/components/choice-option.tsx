import React, { useCallback, useEffect } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";

const ChoiceOption:WAMLComponent<'ChoiceOption'> = ({ node, onInteract, ...props }) => {
  const { interactionToken, logInteraction } = useWAML(true);

  const handleChange = useCallback(() => {
    interactionToken.handleInteract(interactionToken.interactionValue);
    logInteraction({ type: "choice-interaction-click", value: node.value });
  }, [ interactionToken, logInteraction, node.value ]);

  useEffect(() => {
    onInteract?.(interactionToken.selected);
  }, [ interactionToken.selected, onInteract ]);

  return <span {...props}>
    <input type="checkbox" checked={interactionToken.selected} onChange={handleChange} />
    <i>{node.value}</i>
  </span>;
};
ChoiceOption.displayName = "ChoiceOption";
export default componentify(ChoiceOption);