"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const scoped_style_1 = __importDefault(require("./scoped-style"));
const BuiltinStyle = () => <scoped_style_1.default>{`
  @import "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css";
`}</scoped_style_1.default>;
exports.default = (0, react_1.memo)(BuiltinStyle);
