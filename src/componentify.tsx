import type { ReactElement } from "react";
import type { WAMLComponent, WAMLComponentType } from "./types";
import useWAML from "./use-waml";
import { C } from "./react";

export default function componentify<T extends WAMLComponentType>(Component:WAMLComponent<T>):WAMLComponent<T>{
  const R:WAMLComponent<T> = ({ node, ...props }) => {
    const { commonOptions, getComponentOptions } = useWAML();

    const componentOptions = getComponentOptions(Component.displayName) as unknown;

    if(!commonOptions.noDefaultClassName){
      props.className = C(Component.displayName, props.className);
    }
    if(typeof componentOptions === "function"){
      const children = Component({ node, ...props });

      return componentOptions({
        node,
        children: typeof children === "object" ? (children as ReactElement|null)?.props['children'] : null
      });
    }
    return <Component node={node} {...props} {...componentOptions as object} />;
  };
  R.displayName = Component.displayName;
  return R;
}