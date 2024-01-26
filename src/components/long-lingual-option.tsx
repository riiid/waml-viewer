import componentify from "../componentify";
import type { WAMLComponent } from "../types";

const LongLingualOption:WAMLComponent<'LongLingualOption'> = ({ node, ...props }) => <textarea
  placeholder={node.value}
  {...props}
/>;
LongLingualOption.displayName = "LongLingualOption";
export default componentify(LongLingualOption);