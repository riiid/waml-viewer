"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const waml_1 = require("@riiid/waml");
const react_latex_next_1 = __importDefault(require("react-latex-next"));
const componentify_1 = __importDefault(require("../componentify"));
const use_waml_1 = __importDefault(require("../use-waml"));
const inline_1 = __importDefault(require("./inline"));
const anchor_1 = __importDefault(require("./anchor"));
const figure_title_1 = __importDefault(require("./figure-title"));
const figure_caption_1 = __importDefault(require("./figure-caption"));
const choice_option_line_1 = __importDefault(require("./choice-option-line"));
const short_lingual_option_1 = __importDefault(require("./short-lingual-option"));
const long_lingual_option_1 = __importDefault(require("./long-lingual-option"));
const hr_1 = __importDefault(require("./hr"));
const passage_1 = __importDefault(require("./passage"));
const footnote_1 = __importDefault(require("./footnote"));
const react_1 = __importDefault(require("react"));
const LineComponent = ({ node, ...props }) => {
    const { renderingVariables } = (0, use_waml_1.default)();
    if (node === null)
        return react_1.default.createElement("br", null);
    if ((0, waml_1.isMooToken)(node, 'longLingualOption')) {
        return react_1.default.createElement(long_lingual_option_1.default, { node: node });
    }
    if ((0, waml_1.isMooToken)(node, 'hr')) {
        return react_1.default.createElement(hr_1.default, { node: node });
    }
    switch (node.kind) {
        case "LineComponent": {
            const children = node.inlines.map((v, i) => react_1.default.createElement(inline_1.default, { key: i, node: v }));
            if (node.headOption) {
                return react_1.default.createElement(choice_option_line_1.default, { node: node });
            }
            return react_1.default.createElement("span", { ...props }, children);
        }
        case "ClassedBlock":
            renderingVariables.pendingClasses.push(node.name);
            return null;
        case "Math":
            return react_1.default.createElement(react_latex_next_1.default, null, `$$${node.content}$$`);
        case "FigureAddon":
            switch (node.type) {
                case "title":
                    return react_1.default.createElement(figure_title_1.default, { node: node });
                case "caption":
                    return react_1.default.createElement(figure_caption_1.default, { node: node });
            }
        case "Directive":
            switch (node.name) {
                case "answer":
                case "answertype":
                    return null;
                case "passage":
                    return react_1.default.createElement(passage_1.default, { node: node });
            }
        case "Anchor":
            return react_1.default.createElement(anchor_1.default, { node: node });
        case "ShortLingualOption":
            return react_1.default.createElement(short_lingual_option_1.default, { node: node, inline: false });
        case "Footnote":
            return react_1.default.createElement(footnote_1.default, { node: node });
        default:
    }
    throw Error(`Unhandled node: ${JSON.stringify(node)}`);
};
LineComponent.displayName = "LineComponent";
exports.default = (0, componentify_1.default)(LineComponent);
