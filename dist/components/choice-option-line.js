"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const choice_option_1 = __importDefault(require("./choice-option"));
const inline_1 = __importDefault(require("./inline"));
const ChoiceOptionLine = ({ node, style, ...props }) => {
    const [selected, setSelected] = (0, react_1.useState)(false);
    return react_1.default.createElement("label", { style: { display: 'block', ...style }, ...selected ? { 'data-selected': true } : {}, ...props },
        react_1.default.createElement(choice_option_1.default, { node: node.headOption, onInteract: setSelected }),
        node.inlines.map((v, i) => react_1.default.createElement(inline_1.default, { key: i, node: v })));
};
ChoiceOptionLine.displayName = "ChoiceOptionLine";
exports.default = (0, componentify_1.default)(ChoiceOptionLine);
