import type { WAML } from "@riiid/waml";
import { WAMLDocument, hasKind, parseWAML } from "@riiid/waml";
import type { FC, HTMLAttributes, ReactNode } from "react";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import React from "react";
import BuiltinStyle from "./components/builtin-style";
import DebugConsole from "./components/debug-console";
import Document from "./components/document";
import ScopedStyle from "./components/scoped-style";
import SyntaxErrorHandler from "./components/syntax-error-handler";
import type { ASTMiddleware, WAMLViewerOptions } from "./types";
import { WAMLProvider } from "./use-waml";
import PairingLines from "./components/pairing-lines";

const defaultOptions:WAMLViewerOptions = {};
const defaultMiddlewares:ASTMiddleware[] = [];

export interface WAMLViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>{
  waml:string|WAMLDocument;
  middlewares?:ASTMiddleware[];
  options?:WAMLViewerOptions;
  bare?:boolean;
}
const WAMLViewer:FC<WAMLViewerProps> = ({
  waml,
  middlewares = defaultMiddlewares,
  options = defaultOptions,
  bare,
  ...props
}) => {
  const document = useMemo(() => {
    try{
      const R = typeof waml === "string" ? new WAMLDocument(waml) : waml;

      for(const v of middlewares) v(R.raw, R.metadata);
      return R;
    }catch(error){
      if(typeof waml === "string") return parseWAML(waml) as WAML.ParserError;
      throw error;
    }
  }, [ middlewares, waml ]);
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
  if(bare){
    return <>
      {styles.map((v, i) => (
        <ScopedStyle key={i}>{v}</ScopedStyle>
      ))}
      <Document node={document.raw} />
    </>;
  }
  return <article {...props}>
    <BuiltinStyle />
    <WAMLProvider document={document} options={options}>
      {styles.map((v, i) => (
        <ScopedStyle key={i}>{v}</ScopedStyle>
      ))}
      <Document node={document.raw} />
      <PairingLines />
      {options.explanationWrapper
        ? createPortal($explanations, options.explanationWrapper)
        : $explanations
      }
      {options.debug && <DebugConsole document={document} />}
    </WAMLProvider>
  </article>;
};
export default WAMLViewer;