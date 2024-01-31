import React from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";

const Image:WAMLComponent<'Image'> = ({ node, ...props }) => {
  const { getURL } = useWAML();

  return <img alt={node.value.alt} src={getURL(node.value.uri)} {...props} />;
};
Image.displayName = "Image";
export default componentify(Image);