import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";

const Audio:WAMLComponent<'Audio'> = ({ node, ...props }) => {
  const { getURL } = useWAML();

  return <audio title={node.value.alt} src={getURL(node.value.uri)} controls {...props} />;
};
Audio.displayName = "Audio";
export default componentify(Audio);