"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const choice_option_1 = __importDefault(require("./choice-option"));
const inline_1 = __importDefault(require("./inline"));
const ChoiceOptionLine = ({ node, ...props }) => react_1.default.createElement("label", { ...props },
    react_1.default.createElement(choice_option_1.default, { node: node.headOption }),
    node.inlines.map((v, i) => react_1.default.createElement(inline_1.default, { key: i, node: v })));
ChoiceOptionLine.displayName = "ChoiceOptionLine";
exports.default = (0, componentify_1.default)(ChoiceOptionLine);
