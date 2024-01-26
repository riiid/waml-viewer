import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";

const Video:WAMLComponent<'Video'> = ({ node, ...props }) => {
  const { getURL } = useWAML();

  return <video title={node.value.alt} src={getURL(node.value.uri)} controls {...props} />;
};
Video.displayName = "Video";
export default componentify(Video);