"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
const LineComponent = (_a) => {
    var { node } = _a, props = __rest(_a, ["node"]);
    const { renderingVariables } = (0, use_waml_1.default)();
    if (node === null)
        return <br />;
    if ((0, waml_1.isMooToken)(node, 'longLingualOption')) {
        return <long_lingual_option_1.default node={node}/>;
    }
    if ((0, waml_1.isMooToken)(node, 'hr')) {
        return <hr_1.default node={node}/>;
    }
    switch (node.kind) {
        case "LineComponent": {
            const children = node.inlines.map((v, i) => <inline_1.default key={i} node={v}/>);
            if (node.headOption) {
                return <choice_option_line_1.default node={node}/>;
            }
            return <span {...props}>{children}</span>;
        }
        case "ClassedBlock":
            renderingVariables.pendingClasses.push(node.name);
            return null;
        case "Math":
            return <react_latex_next_1.default>{`$$${node.content}$$`}</react_latex_next_1.default>;
        case "FigureAddon":
            switch (node.type) {
                case "title":
                    return <figure_title_1.default node={node}/>;
                case "caption":
                    return <figure_caption_1.default node={node}/>;
            }
        case "Directive":
            switch (node.name) {
                case "answer":
                case "answertype":
                    return null;
                case "passage":
                    return <passage_1.default node={node}/>;
            }
        case "Anchor":
            return <anchor_1.default node={node}/>;
        case "ShortLingualOption":
            return <short_lingual_option_1.default node={node} inline={false}/>;
        case "Footnote":
            return <footnote_1.default node={node}/>;
        default:
    }
    throw Error(`Unhandled node: ${JSON.stringify(node)}`);
};
LineComponent.displayName = "LineComponent";
exports.default = (0, componentify_1.default)(LineComponent);
