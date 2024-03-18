"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const waml_1 = require("@riiid/waml");
const react_latex_next_1 = __importDefault(require("react-latex-next"));
const react_1 = __importDefault(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const choice_option_1 = __importDefault(require("./choice-option"));
const short_lingual_option_1 = __importDefault(require("./short-lingual-option"));
const button_blank_1 = __importDefault(require("./button-blank"));
const image_1 = __importDefault(require("./image"));
const video_1 = __importDefault(require("./video"));
const audio_1 = __importDefault(require("./audio"));
const button_option_1 = __importDefault(require("./button-option"));
const table_1 = __importDefault(require("./table"));
const pairing_option_group_1 = __importDefault(require("./pairing-option-group"));
const choice_option_group_1 = __importDefault(require("./choice-option-group"));
const Inline = ({ node }) => {
    if (typeof node === "string") {
        return node;
    }
    if ((0, waml_1.isMooToken)(node, 'buttonBlank')) {
        return react_1.default.createElement(button_blank_1.default, { node: node });
    }
    if ((0, waml_1.isMooToken)(node, 'medium')) {
        switch (node.value.type) {
            case "image": return react_1.default.createElement(image_1.default, { node: node });
            case "audio": return react_1.default.createElement(audio_1.default, { node: node });
            case "video": return react_1.default.createElement(video_1.default, { node: node });
            default: throw Error(`Unhandled medium type: ${node.value.type}`);
        }
    }
    switch (node.kind) {
        case "StyledInline": {
            const $inlines = node.inlines.map((v, i) => react_1.default.createElement(Inline, { key: i, node: v }));
            switch (node.style) {
                case "underline":
                    return react_1.default.createElement("u", null, $inlines);
                case "bold":
                    return react_1.default.createElement("b", null, $inlines);
                case "italic":
                    return react_1.default.createElement("i", null, $inlines);
                case "strikethrough":
                    return react_1.default.createElement("s", null, $inlines);
                default: throw Error(`Unhandled style: ${node.style}`);
            }
        }
        case "XMLElement":
            switch (node.tag) {
                case "cog":
                    return react_1.default.createElement(choice_option_group_1.default, { node: node.content });
                case "pog":
                    return react_1.default.createElement(pairing_option_group_1.default, { node: node.content });
                case "table":
                    return react_1.default.createElement(table_1.default, { node: node });
                default: throw Error(`Unhandled tag: ${node.tag}`);
            }
        case "Math":
            return react_1.default.createElement(react_latex_next_1.default, null, `$${node.content}$`);
        case "ChoiceOption":
            return react_1.default.createElement(choice_option_1.default, { node: node });
        case "ButtonOption":
            return react_1.default.createElement(button_option_1.default, { node: node });
        case "ShortLingualOption":
            return react_1.default.createElement(short_lingual_option_1.default, { node: node, inline: true });
        case "ClassedInline":
            return (react_1.default.createElement("span", { className: node.name }, node.inlines.map((v, i) => (react_1.default.createElement(Inline, { key: i, node: v })))));
        default:
    }
    throw Error(`Unhandled inline node: ${JSON.stringify(node)}`);
};
Inline.displayName = "Inline";
exports.default = (0, componentify_1.default)(Inline);
