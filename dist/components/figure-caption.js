"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const inline_1 = __importDefault(require("./inline"));
const FigureCaption = ({ node, ...props }) => {
    const children = node.inlines.map((v, i) => react_1.default.createElement(inline_1.default, { key: i, node: v }));
    return react_1.default.createElement("div", { ...props }, children);
};
FigureCaption.displayName = "FigureCaption";
exports.default = (0, componentify_1.default)(FigureCaption);
