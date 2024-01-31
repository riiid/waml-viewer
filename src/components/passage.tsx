import React, { useEffect, useState } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import WAMLViewer from "..";

const Passage:WAMLComponent<'Passage'> = ({ node, fallback, ...props }) => {
  const { getURL } = useWAML();
  const [ payload, setPayload ] = useState<string>();

  useEffect(() => {
    fetch(getURL(node.value)).then(res => res.text()).then(setPayload);
  }, [ getURL, node.value ]);

  if(payload === undefined) return fallback;
  return <WAMLViewer waml={payload} bare {...props} />;
};
Passage.displayName = "Passage";
export default componentify(Passage);