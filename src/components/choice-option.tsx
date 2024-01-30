import { useCallback } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";

const ChoiceOption:WAMLComponent<'ChoiceOption'> = ({ node, ...props }) => {
  const { interactionToken } = useWAML(true);

  const handleChange = useCallback(() => {
    interactionToken.handleInteract(interactionToken.interactionValue);
  }, [ interactionToken ]);

  return <span {...props}>
    <input type="checkbox" checked={interactionToken.selected} onChange={handleChange} />
    <i>{node.value}</i>
  </span>;
};
ChoiceOption.displayName = "ChoiceOption";
export default componentify(ChoiceOption);