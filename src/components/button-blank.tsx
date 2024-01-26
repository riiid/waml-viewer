import componentify from "../componentify";
import type { WAMLComponent } from "../types";

const ButtonBlank:WAMLComponent<'ButtonBlank'> = ({ node, ...props }) => <span {...props} />;
ButtonBlank.displayName = "ButtonBlank";
export default componentify(ButtonBlank);