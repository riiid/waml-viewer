import { createContext, useContext, useMemo } from "react";
import type { WAML, WAMLDocument } from "@riiid/waml";
import type { FCWithChildren } from "./types";

type Context = {
  'metadata': WAML.Metadata
};
type Props = {
  'document': WAMLDocument
};

const context = createContext<Context>(null!);
const useWAML = () => useContext(context);

export default useWAML;
export const WAMLProvider:FCWithChildren<Props> = ({ document, children }) => {
  const value = useMemo<Context>(() => ({
    metadata: document.metadata
  }), [ document.metadata ]);

  return <context.Provider value={value}>
    {children}
  </context.Provider>;
};