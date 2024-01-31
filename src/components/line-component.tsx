import { isMooToken } from "@riiid/waml";
import Latex from "react-latex-next";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import Inline from "./inline";
import Anchor from "./anchor";
import FigureTitle from "./figure-title";
import FigureCaption from "./figure-caption";
import ChoiceOptionLine from "./choice-option-line";
import ShortLingualOption from "./short-lingual-option";
import LongLingualOption from "./long-lingual-option";
import HR from "./hr";
import Passage from "./passage";
import Footnote from "./footnote";
import React from "react";

const LineComponent:WAMLComponent<'LineComponent'> = ({ node, ...props }) => {
  const { renderingVariables } = useWAML();

  if(node === null) return <br />;
  if(isMooToken(node, 'longLingualOption')){
    return <LongLingualOption node={node} />;
  }
  if(isMooToken(node, 'hr')){
    return <HR node={node} />;
  }
  switch(node.kind){
    case "LineComponent": {
      const children = node.inlines.map((v, i) => <Inline key={i} node={v} />);

      if(node.headOption){
        return <ChoiceOptionLine node={node} />;
      }
      return <span {...props}>{children}</span>;
    }
    case "ClassedBlock":
      renderingVariables.pendingClasses.push(node.name);
      return null;
    case "Math":
      return <Latex>{`$$${node.content}$$`}</Latex>;
    case "FigureAddon":
      switch(node.type){
        case "title":
          return <FigureTitle node={node} />;
        case "caption":
          return <FigureCaption node={node} />;
      }
    case "Directive":
      switch(node.name){
        case "answer":
        case "answertype":
          return null;
        case "passage":
          return <Passage node={node} />;
      }
    case "Anchor":
      return <Anchor node={node} />;
    case "ShortLingualOption":
      return <ShortLingualOption node={node} inline={false} />;
    case "Footnote":
      return <Footnote node={node} />;
    default:
  }
  throw Error(`Unhandled node: ${JSON.stringify(node)}`);
};
LineComponent.displayName = "LineComponent";
export default componentify(LineComponent);