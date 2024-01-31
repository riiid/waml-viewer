import type { ReactNode } from "react";
import React, { Component, useMemo } from "react";
import type { WAML } from "@riiid/waml";
import { hasKind } from "@riiid/waml";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import WAMLError from "../waml-error";
import SemanticErrorHandler from "./semantic-error-handler";
import IsoprefixedLineGroupRenderer from "./isoprefixed-line-group-renderer";

const Document:WAMLComponent<'Document'> = ({ node, ...props }) => {
  const lines = useMemo(() => {
    const R:WAML.Line[] = [];
    let lastMeaningfulLineIndex = 0;

    for(const v of node){
      if(!hasKind(v, 'Line')) continue;
      R.push(v);
      if(v.component === null) continue;
      if(hasKind(v.component, 'Directive')) continue;
      lastMeaningfulLineIndex = R.length - 1;
    }
    return R.slice(0, lastMeaningfulLineIndex + 1);
  }, [ node ]);

  return <WAMLErrorBoundary document={node}>
    <section {...props}>
      <IsoprefixedLineGroupRenderer lines={lines} />
    </section>
  </WAMLErrorBoundary>;
};
Document.displayName = "Document";
export default componentify(Document);

type WAMLErrorBoundaryProps = { 'document': WAML.Document, 'children': ReactNode };
// eslint-disable-next-line react/require-optimization
class WAMLErrorBoundary extends Component<WAMLErrorBoundaryProps, { error: WAMLError|undefined }>{
  constructor(props:WAMLErrorBoundaryProps){
    super(props);
    this.state = { error: undefined };
  }
  public override componentDidCatch(error:Error):void{
    if(error instanceof WAMLError){
      this.setState({ error });
    }else{
      throw error;
    }
  }
  public override componentDidUpdate(prevProps:WAMLErrorBoundaryProps):void{
    if(prevProps.document !== this.props.document){
      this.setState({ error: undefined });
    }
  }
  public override render():any{
    if(this.state.error){
      return <SemanticErrorHandler node={this.state.error} />;
    }
    return this.props.children;
  }
}