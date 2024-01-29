import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import Inline from "./inline";

const PairingOption:WAMLComponent<'PairingOption'> = ({ node, ...props }) => <li key={node.cell.value} {...props}>
  {node.cell.inbound.length > 0 && <input type="radio" readOnly />}
  {node.inlines.map((v, i) => <Inline key={i} node={v} />)}
  {node.cell.outbound.length > 0 && <input type="radio" readOnly />}
</li>;
PairingOption.displayName = "PairingOption";
export default componentify(PairingOption);