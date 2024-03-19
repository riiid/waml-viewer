import { isMooToken } from "@riiid/waml";
import Latex from "react-latex-next";
import React from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import ChoiceOption from "./choice-option";
import ShortLingualOption from "./short-lingual-option";
import ButtonBlank from "./button-blank";
import Image from "./image";
import Video from "./video";
import Audio from "./audio";
import ButtonOption from "./button-option";
import Table from "./table";
import PairingOptionGroup from "./pairing-option-group";
import ChoiceOptionGroup from "./choice-option-group";
import InlineKnob from "./inline-knob";
import ButtonKnob from "./button-knob";

const Inline:WAMLComponent<'Inline'> = ({ node }) => {
  if(typeof node === "string"){
    return node;
  }
  if(isMooToken(node, 'buttonBlank')){
    return <ButtonBlank node={node} />;
  }
  if(isMooToken(node, 'medium')){
    switch(node.value.type){
      case "image": return <Image node={node} />;
      case "audio": return <Audio node={node} />;
      case "video": return <Video node={node} />;
      default: throw Error(`Unhandled medium type: ${node.value.type}`);
    }
  }
  if(isMooToken(node, 'forcedLineBreak')){
    return <br />;
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
        default: throw Error(`Unhandled style: ${node.style}`);
      }
    }
    case "XMLElement":
      switch(node.tag){
        case "cog":
          return <ChoiceOptionGroup node={node.content} />;
        case "pog":
          return <PairingOptionGroup node={node.content} />;
        case "table":
          return <Table node={node} />;
        default: throw Error(`Unhandled tag: ${JSON.stringify(node)}`);
      }
    case "Math":
      return <Latex>{`$${node.content}$`}</Latex>;
    case "ChoiceOption":
      return <ChoiceOption node={node} />;
    case "ButtonOption":
      return <ButtonOption node={node} />;
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
    case "InlineKnob":
      return <InlineKnob node={node} />;
    case "ButtonKnob":
      return <ButtonKnob node={node} />;
    default:
  }
  throw Error(`Unhandled inline node: ${JSON.stringify(node)}`);
};
Inline.displayName = "Inline";
export default componentify(Inline);