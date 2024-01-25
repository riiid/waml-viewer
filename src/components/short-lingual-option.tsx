import componentify from "../componentify";
import type { WAMLComponent } from "../types";

const ShortLingualOption:WAMLComponent<'ShortLingualOption'> = ({ node, inline, ...props }) => <input
  type="text"
  {...inline ? { 'data-inline': true } : {}}
  {...node.defaultValue ? { defaultValue: node.value } : { placeholder: node.value }}
  {...props}
/>;
ShortLingualOption.displayName = "ShortLingualOption";
export default componentify(ShortLingualOption);