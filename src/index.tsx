import type { FC } from "react";
import { useMemo, useState } from "react";
import { WAMLDocument } from "@riiid/waml";

export interface WAMLViewerProps{
  waml:string;
}
const WAMLViewer:FC<WAMLViewerProps> = ({ waml }) => {
  const [ currentError, setCurrentError ] = useState<string>();

  const document = useMemo(() => {
    try{
      const R = new WAMLDocument(waml);
      setCurrentError(undefined);
      return R;
    }catch(error){
      if(error instanceof Error) console.warn(error.stack);
      setCurrentError(String(error));
      return undefined;
    }
  }, [ waml ]);

  if(currentError){
    return <article>{currentError}</article>;
  }
  return <article>
    <h2>Hello, World!</h2>
    <pre>
      {JSON.stringify(document, null, 2)}
    </pre>
  </article>;
};
export default WAMLViewer;