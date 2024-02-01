import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import type { FC } from "react";
import { memo } from "react";
import useWAML from "../use-waml";
import PairingLine from "./pairing-line";

const PairingLines:FC = () => {
  const { pairing, renderingVariables } = useWAML();
  const [ lines, setLines ] = useState<ReactNode[]>([]);

  useEffect(() => {
    const $lines:ReactNode[] = [];

    for(const k in pairing.pairedVertices){
      for(const w of pairing.pairedVertices[k]){
        // 양방향으로 있기 때문에 하나만 골라 그리면 됩니다.
        if(!('to' in w)) continue;
        const from = k;
        const to = w.to;
        const $from = renderingVariables.pairingOptionDots[from]?.[1];
        const $to = renderingVariables.pairingOptionDots[to]?.[0];
        if(!$from || !$to) continue;

        $lines.push(<PairingLine key={$lines.length} node={`${from}→${to}`} from={$from} to={$to} />);
      }
    }
    setLines($lines);
  }, [ pairing.pairedVertices, renderingVariables.pairingOptionDots ]);

  return <svg width="100%" height="100%" style={{ position: "fixed", left: 0, top: 0, pointerEvents: "none" }}>
    {lines}
  </svg>;
};
export default memo(PairingLines);