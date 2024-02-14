import React, { memo, useMemo, type ReactElement } from "react";
import { C } from "./react.js";
import type { WAMLViewerOptions } from "./types.js";
import { type WAMLComponent, type WAMLComponentType } from "./types.js";
import useWAML from "./use-waml.js";

export default function componentify<T extends WAMLComponentType>(Component:WAMLComponent<T>):WAMLComponent<T>{
  const R:WAMLComponent<T> = ({ node, ...props }) => {
    const { commonOptions, getComponentOptions } = useWAML();
    const componentOptions = useMemo(() => {
      const r = getComponentOptions(Component.displayName);

      if(!r || typeof r === "function") return r;
      if('getter' in r) return r.getter(node as any) as WAMLViewerOptions[T];
      return r;
    }, [ getComponentOptions, node ]);
    const className = useMemo(() => {
      if(!componentOptions || typeof componentOptions === "function"){
        return C(!commonOptions.noDefaultClassName && Component.displayName, props.className);
      }
      let r = componentOptions;
      if('getter' in r){
        r = r.getter(node as any) as any;
      }
      return C(!commonOptions.noDefaultClassName && Component.displayName, (r as any)['className']);
    }, [ commonOptions.noDefaultClassName, componentOptions, node, props.className ]);

    if(typeof componentOptions === "function"){
      const children = Component({ node, ...props as any, className });

      return componentOptions({
        node,
        children: typeof children === "object" ? (children as ReactElement|null)?.props['children'] : null
      } as any);
    }
    return <Component node={node} {...props} {...componentOptions as any} className={className} />;
  };
  R.displayName = Component.displayName;

  return Object.assign(memo(R), { displayName: R.displayName }) as WAMLComponent<T>;
}