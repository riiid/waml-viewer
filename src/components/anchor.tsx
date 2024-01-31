import React from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import Inline from "./inline";

const Anchor:WAMLComponent<'Anchor'> = ({ node, ...props }) => <div {...props}>
  {node.inlines.map((v, i) => <Inline key={i} node={v} />)}
</div>;
Anchor.displayName = "Anchor";
export default componentify(Anchor);