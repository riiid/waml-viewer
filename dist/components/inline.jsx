"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const waml_1 = require("@riiid/waml");
const react_latex_next_1 = __importDefault(require("react-latex-next"));
const componentify_1 = __importDefault(require("../componentify"));
const choice_option_1 = __importDefault(require("./choice-option"));
const short_lingual_option_1 = __importDefault(require("./short-lingual-option"));
const button_blank_1 = __importDefault(require("./button-blank"));
const image_1 = __importDefault(require("./image"));
const video_1 = __importDefault(require("./video"));
const audio_1 = __importDefault(require("./audio"));
const button_option_1 = __importDefault(require("./button-option"));
const Inline = ({ node }) => {
    if (typeof node === "string") {
        return node;
    }
    if ((0, waml_1.isMooToken)(node, 'buttonBlank')) {
        return <button_blank_1.default node={node}/>;
    }
    if ((0, waml_1.isMooToken)(node, 'medium')) {
        switch (node.value.type) {
            case "image": return <image_1.default node={node}/>;
            case "audio": return <audio_1.default node={node}/>;
            case "video": return <video_1.default node={node}/>;
            default: throw Error(`Unhandled medium type: ${node.value.type}`);
        }
    }
    switch (node.kind) {
        case "StyledInline": {
            const $inlines = node.inlines.map((v, i) => <Inline key={i} node={v}/>);
            switch (node.style) {
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
            return <react_latex_next_1.default>{`$${node.content}$`}</react_latex_next_1.default>;
        case "ChoiceOption":
            return <choice_option_1.default node={node}/>;
        case "ButtonOption":
            return <button_option_1.default node={node}/>;
        case "ShortLingualOption":
            return <short_lingual_option_1.default node={node} inline/>;
        case "ClassedInline":
            return (<span className={node.name}>
          {node.inlines.map((v, i) => (<Inline key={i} node={v}/>))}
        </span>);
        default:
            throw Error(`Unhandled inline node: ${JSON.stringify(node)}`);
    }
};
Inline.displayName = "Inline";
exports.default = (0, componentify_1.default)(Inline);
