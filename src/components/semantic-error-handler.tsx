import type { WAMLComponent } from "../types";
import componentify from "../componentify";

const SemanticErrorHandler:WAMLComponent<'SemanticErrorHandler'> = ({ node, ...props }) => <pre {...props}>
  {node.message}
</pre>;
SemanticErrorHandler.displayName = "SemanticErrorHandler";
export default componentify(SemanticErrorHandler);