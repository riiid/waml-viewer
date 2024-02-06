import React, { useState } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import ChoiceOption from "./choice-option";
import Inline from "./inline";

const ChoiceOptionLine:WAMLComponent<'ChoiceOptionLine'> = ({ node, style, ...props }) => {
  const [ selected, setSelected ] = useState(false);

  return <label
    style={{ display: 'block', ...style }}
    {...selected ? { 'data-selected': true } : {}}
    {...props}
  >
    <ChoiceOption node={node.headOption!} onInteract={setSelected} />
    {node.inlines.map((v, i) => <Inline key={i} node={v} />)}
  </label>;
};
ChoiceOptionLine.displayName = "ChoiceOptionLine";
export default componentify(ChoiceOptionLine);