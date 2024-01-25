import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import ChoiceOption from "./choice-option";
import Inline from "./inline";

const ChoiceOptionLine:WAMLComponent<'ChoiceOptionLine'> = ({ node, ...props }) => <label {...props}>
  <ChoiceOption node={node.headOption!} />
  {node.inlines.map((v, i) => <Inline key={i} node={v} />)}
</label>;
ChoiceOptionLine.displayName = "ChoiceOptionLine";
export default componentify(ChoiceOptionLine);