import { WAML } from "@riiid/waml";
import { hasKind } from "@riiid/waml";
import { WAMLDocument, parseWAML } from "@riiid/waml";
import type { FC, HTMLAttributes, ReactNode } from "react";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import { WAMLProvider } from "./use-waml";
import SyntaxErrorHandler from "./components/syntax-error-handler";
import type { ASTMiddleware, WAMLViewerOptions } from "./types";
import ScopedStyle from "./components/scoped-style";
import DebugConsole from "./components/debug-console";
import Document from "./components/document";
import BuiltinStyle from "./components/builtin-style";
import PairingOption from "./components/pairing-option";
import PairingOptionList from "./components/pairing-option-list";

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
  const pairingGroups = useMemo(() => {
    if('error' in document) return {};
    const R:Record<string, ReactNode> = {};
    const vertexGroups:Record<string, ReactNode[]> = {};

    for(const v of document.raw){
      if(!hasKind(v, 'Line')) continue;
      if(!v.component || !hasKind(v.component, 'PairingOption')) continue;
      const $baby = <PairingOption key={v.component.cell.value} node={v.component} />;
      let key:string;

      if(v.component.cell.inbound.length){
        key = `${v.component.cell.inbound[0].name}/next`;
      }else{
        key = `${v.component.cell.outbound[0].name}/prev`;
      }
      vertexGroups[key] ??= [];
      vertexGroups[key].push($baby);
    }
    for(const v of document.metadata.answerFormat.interactions){
      if(v.type !== WAML.InteractionType.PAIRING_NET){
        continue;
      }
      const prevVertices = vertexGroups[`${v.name}/prev`];
      const nextVertices = vertexGroups[`${v.name}/next`];

      if(prevVertices?.length) R[v.fromValues[0]] = <PairingOptionList key="prev" node={prevVertices} />;
      if(nextVertices?.length) R[v.toValues[0]] = <PairingOptionList key="next" node={nextVertices} />;
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
      <WAMLProvider document={document} options={options} pairingGroups={pairingGroups}>
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
    <WAMLProvider document={document} options={options} pairingGroups={pairingGroups}>
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