import componentify from "../componentify";
import type { WAMLComponent } from "../types";

const ChoiceOption:WAMLComponent<'ChoiceOption'> = ({ node, ...props }) => <span {...props}>
  <input type="checkbox" value={node.value} />
  <i>{node.value}</i>
</span>;
ChoiceOption.displayName = "ChoiceOption";
export default componentify(ChoiceOption);