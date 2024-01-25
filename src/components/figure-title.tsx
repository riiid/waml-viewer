import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import Inline from "./inline";

const FigureTitle:WAMLComponent<'FigureTitle'> = ({ node, ...props }) => {
  const children = node.inlines.map((v, i) => <Inline key={i} node={v} />);

  return <div {...props}>{children}</div>;
};
FigureTitle.displayName = "FigureTitle";
export default componentify(FigureTitle);