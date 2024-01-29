import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useRef } from "react";
import type { WAML, WAMLDocument } from "@riiid/waml";
import type { FCWithChildren, WAMLComponentType, WAMLViewerOptions } from "./types";

type SplittedFormOf<T extends string> = T extends `${infer A}${infer B}`
  ? B extends ""
  ? [A]
  : [A, ...SplittedFormOf<B>]
  : []
;
type FirstLetterOf<T extends string> = SplittedFormOf<T>[0];

type Context = {
  'metadata': WAML.Metadata,
  'commonOptions': {
    [key in keyof WAMLViewerOptions as FirstLetterOf<key> extends Lowercase<FirstLetterOf<key>> ? key : never]: WAMLViewerOptions[key]
  },
  'getComponentOptions': <T extends WAMLComponentType>(type:T) => WAMLViewerOptions[T],
  'getURL': (uri:string) => string,

  'renderingVariables': {
    'pendingClasses': string[],
    'pairingGroups': Props['pairingGroups']
  }
};
type Props = {
  'document': WAMLDocument|WAML.ParserError,
  'options': WAMLViewerOptions,
  'pairingGroups': Record<string, ReactNode>
};

const context = createContext<Context>(null!);
const useWAML = () => useContext(context);

export default useWAML;
export const WAMLProvider:FCWithChildren<Props> = ({ document, options, pairingGroups, children }) => {
  const $renderingVariables = useRef<Context['renderingVariables']>({
    pendingClasses: [],
    pairingGroups
  });

  const value = useMemo<Context>(() => ({
    metadata: 'error' in document ? null! : document.metadata,
    commonOptions: {
      noDefaultClassName: options.noDefaultClassName || false
    },
    getComponentOptions: type => options[type],
    getURL: options.uriResolver || (uri => uri),

    renderingVariables: $renderingVariables.current
  }), [ document, options ]);

  return <context.Provider value={value}>
    {children}
  </context.Provider>;
};