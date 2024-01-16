import type { WAML } from "@riiid/waml";
import { WAMLDocument, parseWAML } from "@riiid/waml";
import type { FC, HTMLAttributes } from "react";
import { useMemo } from "react";
import { WAMLProvider } from "./use-waml";

export interface WAMLViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>{
  waml:string;
}
const WAMLViewer:FC<WAMLViewerProps> = ({ waml, ...props }) => {
  const document = useMemo(() => {
    try{
      return new WAMLDocument(waml);
    }catch(error){
      return parseWAML(waml) as WAML.ParserError;
    }
  }, [ waml ]);

  if('error' in document){
    return <article {...props}>
      <pre>{document.stack?.join('\n') || document.message}</pre>
    </article>;
  }
  return <article {...props}>
    <WAMLProvider document={document}>
      <h2>Hello, World!</h2>
      <pre>
        {JSON.stringify(document, null, 2)}
      </pre>
    </WAMLProvider>
  </article>;
};
export default WAMLViewer;