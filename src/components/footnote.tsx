import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import Inline from "./inline";

const Footnote:WAMLComponent<'Footnote'> = ({ node, ...props }) => <div {...props}>
  {node.inlines.map((v, i) => <Inline key={i} node={v} />)}
</div>;
Footnote.displayName = "Footnote";
export default componentify(Footnote);