import React from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import PairingOption from "./pairing-option";

const PairingOptionGroup:WAMLComponent<'PairingOptionGroup'> = ({ node, ...props }) => <ul {...props}>
  {node.map(v => <PairingOption key={v.cell.value} node={v} />)}
</ul>;
PairingOptionGroup.displayName = "PairingOptionGroup";
export default componentify(PairingOptionGroup);