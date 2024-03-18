import React from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import Inline from "./inline";

const ChoiceOptionGroup:WAMLComponent<'ChoiceOptionGroup'> = ({ node, ...props }) => <div {...props}>
  {node.map((v, i) => <Inline key={i} node={v} />)}
</div>;
ChoiceOptionGroup.displayName = "ChoiceOptionGroup";
export default componentify(ChoiceOptionGroup);