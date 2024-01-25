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

  'renderingVariables': {
    'pendingClasses': string[]
  }
};
type Props = {
  'document': WAMLDocument|WAML.ParserError,
  'options': WAMLViewerOptions
};

const context = createContext<Context>(null!);
const useWAML = () => useContext(context);

export default useWAML;
export const WAMLProvider:FCWithChildren<Props> = ({ document, options, children }) => {
  const $renderingVariables = useRef<Context['renderingVariables']>({
    pendingClasses: []
  });

  const value = useMemo<Context>(() => ({
    metadata: 'error' in document ? null! : document.metadata,
    commonOptions: {
      noDefaultClassName: options.noDefaultClassName || false
    },
    getComponentOptions: type => options[type],

    renderingVariables: $renderingVariables.current
  }), [ document, options ]);

  return <context.Provider value={value}>
    {children}
  </context.Provider>;
};