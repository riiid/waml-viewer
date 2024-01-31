import type { ChangeEventHandler } from "react";
import { useCallback } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import React from "react";

const LongLingualOption:WAMLComponent<'LongLingualOption'> = ({ node, ...props }) => {
  const { interactionToken } = useWAML(true);

  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(e => {
    interactionToken.handleInteract(e.currentTarget.value);
  }, [ interactionToken ]);

  return <textarea
    placeholder={node.value}
    value={interactionToken.interactionValue}
    onChange={handleChange}
    {...props}
  />;
};
LongLingualOption.displayName = "LongLingualOption";
export default componentify(LongLingualOption);