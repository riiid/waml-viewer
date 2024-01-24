import type { WAMLComponent } from "../types";
import componentify from "../componentify";

const SyntaxErrorHandler:WAMLComponent<'SyntaxErrorHandler'> = ({ node, ...props }) => <pre {...props}>
  {node.stack?.join('\n') || node.message}
</pre>;
SyntaxErrorHandler.displayName = "SyntaxErrorHandler";
export default componentify(SyntaxErrorHandler);