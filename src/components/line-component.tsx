import { isMooToken } from "@riiid/waml";
import Latex from "react-latex-next";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import { NOT_YET_IMPLEMENTED } from "../waml-error";
import Inline from "./inline";
import Anchor from "./anchor";
import FigureTitle from "./figure-title";
import FigureCaption from "./figure-caption";
import ChoiceOptionLine from "./choice-option-line";
import ShortLingualOption from "./short-lingual-option";

const LineComponent:WAMLComponent<'LineComponent'> = ({ node, ...props }) => {
  const { renderingVariables } = useWAML();

  if(node === null) return <div typeof="empty-line" />;
  if(isMooToken(node, 'longLingualOption')){
    throw NOT_YET_IMPLEMENTED;
  }
  if(isMooToken(node, 'hr')){
    return <hr />;
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
    case "XMLElement":
      switch(node.tag){
        case "table":
          throw NOT_YET_IMPLEMENTED;
      }
    case "Directive":
      switch(node.name){
        case "answer":
          return null;
      }
      break;
    case "Anchor":
      return <Anchor node={node} />;
    case "ShortLingualOption":
      return <ShortLingualOption node={node} inline={false} />;
  }
  throw Error(`Unhandled node: ${JSON.stringify(node)}`);
};
LineComponent.displayName = "LineComponent";
export default componentify(LineComponent);