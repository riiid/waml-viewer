import { isMooToken } from "@riiid/waml";
import Latex from "react-latex-next";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import { NOT_YET_IMPLEMENTED } from "../waml-error";
import ChoiceOption from "./choice-option";
import ShortLingualOption from "./short-lingual-option";

const Inline:WAMLComponent<'Inline'> = ({ node }) => {
  if(typeof node === "string"){
    return node;
  }
  if(isMooToken(node, 'buttonBlank')){
    throw NOT_YET_IMPLEMENTED;
  }
  if(isMooToken(node, 'medium')){
    throw NOT_YET_IMPLEMENTED;
  }
  switch(node.kind){
    case "StyledInline": {
      const $inlines = node.inlines.map((v, i) => <Inline key={i} node={v} />);

      switch(node.style){
        case "underline":
          return <u>{$inlines}</u>;
        case "bold":
          return <b>{$inlines}</b>;
        case "italic":
          return <i>{$inlines}</i>;
        case "strikethrough":
          return <s>{$inlines}</s>;
      }
    }
    case "Math":
      return <Latex>{`$${node.content}$`}</Latex>;
    case "ChoiceOption":
      return <ChoiceOption node={node} />;
    case "ButtonOption":
      throw NOT_YET_IMPLEMENTED;
    case "ShortLingualOption":
      return <ShortLingualOption node={node} inline />;
    case "ClassedInline":
      return (
        <span className={node.name}>
          {node.inlines.map((v, i) => (
            <Inline key={i} node={v} />
          ))}
        </span>
      );
    default:
      throw Error(`Unhandled inline node: ${JSON.stringify(node)}`);
  }
};
Inline.displayName = "Inline";
export default componentify(Inline);