import type { MouseEventHandler } from "react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { WAML } from "@riiid/waml";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";

const PairingLine:WAMLComponent<'PairingLine'> = ({ node, from, to, onClick, style, ...props }) => {
  const { setFlattenValue, logInteraction } = useWAML();
  // eslint-disable-next-line react/hook-use-state
  const [ , setCounter ] = useState(0);

  const $container = useMemo(() => {
    const $R = from.closest<HTMLElement>("article > section");
    if(!$R) throw Error("WAML container document not found");
    return $R;
  }, [ from ]);

  const containerRect = $container.getBoundingClientRect();
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();

  const handleClick = useCallback<MouseEventHandler<SVGLineElement>>(e => {
    onClick?.(e as any);
    if(e.defaultPrevented) return;
    logInteraction({ type: "pairing-line-click", value: node });
    setFlattenValue((prev, interactions) => {
      const next = [ ...prev ];

      for(const v of interactions){
        if(v.type !== WAML.InteractionType.PAIRING_NET) continue;
        if(!prev[v.index]) continue;
        next[v.index] = {
          type: "MULTIPLE",
          ordered: false,
          value: prev[v.index].value.filter(w => w !== node)
        };
      }
      return next;
    });
  }, [ logInteraction, node, onClick, setFlattenValue ]);

  useEffect(() => {
    const onTick = () => {
      setCounter(prev => prev + 1);
      timer = window.requestAnimationFrame(onTick);
    };
    let timer = window.requestAnimationFrame(onTick);

    return () => window.cancelAnimationFrame(timer);
  }, []);

  return <line
    {...props as any}
    style={{ pointerEvents: "all", ...style }}
    onClick={handleClick}
    x1={fromRect.left + 0.5 * fromRect.width - containerRect.left}
    y1={fromRect.top + 0.5 * fromRect.height - containerRect.top}
    x2={toRect.left + 0.5 * toRect.width - containerRect.left}
    y2={toRect.top + 0.5 * toRect.height - containerRect.top}
  />;
};
PairingLine.displayName = "PairingLine";
export default componentify(PairingLine);