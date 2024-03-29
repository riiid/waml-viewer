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
import type { ASTMiddleware, WAMLAction, WAMLUserInteraction, WAMLViewerOptions } from "./types";
import { WAMLProvider } from "./use-waml";
import PairingLines from "./components/pairing-lines";

const defaultOptions:WAMLViewerOptions = {};
const defaultMiddlewares:ASTMiddleware[] = [];

export interface WAMLViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'defaultValue'|'onChange'>{
  waml:string|WAMLDocument;
  middlewares?:ASTMiddleware[];
  options?:WAMLViewerOptions;
  bare?:boolean;
  defaultValue?:WAML.Answer;
  value?:WAML.Answer;
  onChange?(value:WAML.Answer):void;
  onInteract?(e:WAMLUserInteraction):void;
  /**
   * 특정 조건에 의해 액션 스크립트가 실행될 때 호출되는 이벤트 핸들러.
   *
   * 이 함수가 바뀔 때마다 `onLoad` 조건이 성립되기 때문에
   * 이 함수를 `useCallback` 등으로 메모이제이션하는 것이 권장됩니다.
   *
   * @param e 실행되는 액션 스크립트 객체.
   */
  onKnobAction?(e:WAMLAction):void;
}
const WAMLViewer:FC<WAMLViewerProps> = ({
  waml,
  middlewares = defaultMiddlewares,
  options = defaultOptions,
  bare,
  defaultValue,
  value,
  onChange,
  onInteract,
  onKnobAction,
  children,
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
      <BuiltinStyle>{options.builtinCSS}</BuiltinStyle>
      <WAMLProvider document={document} options={options} value={value} defaultValue={defaultValue} onChange={onChange}>
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
    <BuiltinStyle>{options.builtinCSS}</BuiltinStyle>
    <WAMLProvider document={document} options={options} value={value} defaultValue={defaultValue} onChange={onChange} onInteract={onInteract} onKnobAction={onKnobAction}>
      {styles.map((v, i) => (
        <ScopedStyle key={i}>{v}</ScopedStyle>
      ))}
      <Document node={document.raw} style={{ position: "relative" }}>
        <PairingLines />
      </Document>
      {options.explanationWrapper
        ? createPortal($explanations, options.explanationWrapper)
        : $explanations
      }
      {children}
      {options.debug && <DebugConsole document={document} />}
    </WAMLProvider>
  </article>;
};
export default WAMLViewer;
export * from "./types";