import type { ChangeEventHandler } from "react";
import { useCallback } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import React from "react";

const ShortLingualOption:WAMLComponent<'ShortLingualOption'> = ({ node, inline, ...props }) => {
  const { interactionToken } = useWAML(true);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    interactionToken.handleInteract(e.currentTarget.value);
  }, [ interactionToken ]);

  return <input
    type="text"
    value={interactionToken.interactionValue}
    onChange={handleChange}
    {...inline ? { 'data-inline': true } : {}}
    {...node.defaultValue ? { defaultValue: node.value } : { placeholder: node.value }}
    {...props}
  />;
};
ShortLingualOption.displayName = "ShortLingualOption";
export default componentify(ShortLingualOption);