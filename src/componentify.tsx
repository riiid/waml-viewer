import { memo, type ReactElement } from "react";
import { C } from "./react";
import type { WAMLComponent, WAMLComponentType } from "./types";
import useWAML from "./use-waml";

export default function componentify<T extends WAMLComponentType>(Component:WAMLComponent<T>):WAMLComponent<T>{
  const R:WAMLComponent<T> = ({ node, ...props }) => {
    const { commonOptions, getComponentOptions } = useWAML();

    const componentOptions = getComponentOptions(Component.displayName) as unknown;

    if(!commonOptions.noDefaultClassName){
      Object.assign(props, { className: C(Component.displayName, props.className) });
    }
    if(typeof componentOptions === "function"){
      const children = Component({ node, ...props as any });

      return componentOptions({
        node,
        children: typeof children === "object" ? (children as ReactElement|null)?.props['children'] : null
      });
    }
    return <Component node={node} {...props} {...componentOptions as any} />;
  };
  R.displayName = Component.displayName;

  return Object.assign(memo(R), { displayName: R.displayName }) as WAMLComponent<T>;
}