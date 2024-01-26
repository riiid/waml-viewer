import componentify from "../componentify";
import type { WAMLComponent } from "../types";

const ButtonOption:WAMLComponent<'ButtonOption'> = ({ node, ...props }) => <button {...props}>
  {node.value}
</button>;
ButtonOption.displayName = "ButtonOption";
export default componentify(ButtonOption);