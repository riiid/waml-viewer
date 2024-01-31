import React from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import Inline from "./inline";

const FigureCaption:WAMLComponent<'FigureCaption'> = ({ node, ...props }) => {
  const children = node.inlines.map((v, i) => <Inline key={i} node={v} />);

  return <div {...props}>{children}</div>;
};
FigureCaption.displayName = "FigureCaption";
export default componentify(FigureCaption);