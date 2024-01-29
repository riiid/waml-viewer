import componentify from "../componentify";
import type { WAMLComponent } from "../types";

const PairingOptionList:WAMLComponent<'PairingOptionList'> = ({ node, ...props }) => <ul {...props}>{node}</ul>;
PairingOptionList.displayName = "PairingOptionList";
export default componentify(PairingOptionList);