import type { WAML } from "@riiid/waml";
import { hasKind } from "@riiid/waml";
import { WAMLDocument, parseWAML } from "@riiid/waml";
import type { FC, HTMLAttributes, ReactNode } from "react";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import { WAMLProvider } from "./use-waml";
import SyntaxErrorHandler from "./components/syntax-error-handler";
import type { WAMLViewerOptions } from "./types";
import ScopedStyle from "./components/scoped-style";
import DebugConsole from "./components/debug-console";
import Document from "./components/document";
import BuiltinStyle from "./components/builtin-style";

const EMPTY_OPTIONS:WAMLViewerOptions = {};

export interface WAMLViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>{
  waml:string;
  options?:WAMLViewerOptions;
}
const WAMLViewer:FC<WAMLViewerProps> = ({ waml, options = EMPTY_OPTIONS, ...props }) => {
  const document = useMemo(() => {
    try{
      return new WAMLDocument(waml);
    }catch(error){
      return parseWAML(waml) as WAML.ParserError;
    }
  }, [ waml ]);
  const $explanations = useMemo(() => {
    if('error' in document) return [];
    const R:ReactNode[] = [];

    for(const v of document.raw){
      if(!hasKind(v, 'XMLElement')) continue;
      if(v.tag !== "explanation") continue;
      R.push(<Document key={R.length} node={v.content} />);
    }
    return R;
  }, [ document ]);
  const styles = useMemo(() => {
    if('error' in document) return [];
    const R:string[] = [];

    for(const v of document.raw){
      if(!hasKind(v, 'XMLElement')) continue;
      if(v.tag !== "style") continue;
      R.push(v.content);
    }
    return R;
  }, [ document ]);

  if('error' in document){
    return <article {...props}>
      <BuiltinStyle />
      <WAMLProvider document={document} options={options}>
        <SyntaxErrorHandler node={document} />
      </WAMLProvider>
    </article>;
  }
  return <article {...props}>
    <BuiltinStyle />
    <WAMLProvider document={document} options={options}>
      {styles.map((v, i) => (
        <ScopedStyle key={i}>{v}</ScopedStyle>
      ))}
      <Document node={document.raw} />
      {options.explanationWrapper
        ? createPortal($explanations, options.explanationWrapper)
        : $explanations
      }
      {options.debug && <DebugConsole document={document} />}
    </WAMLProvider>
  </article>;
};
export default WAMLViewer;