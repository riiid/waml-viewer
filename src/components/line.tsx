import { hasKind } from "@riiid/waml";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import LineComponent from "./line-component";

const Line:WAMLComponent<'Line'> = ({ node, next, ...props }) => {
  if(node.component && hasKind(node.component, 'Anchor')){
    return null;
  }
  const anchored = next?.component && hasKind(next.component, 'Anchor');

  return <div {...props} {...anchored ? { 'data-anchored': true } : {}}>
    <LineComponent node={node.component} />
    {anchored && <LineComponent node={next.component} />}
  </div>;
};
Line.displayName = "Line";
export default componentify(Line);