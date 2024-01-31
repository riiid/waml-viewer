"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const componentify_1 = __importDefault(require("../componentify"));
const react_1 = __importDefault(require("react"));
const SyntaxErrorHandler = ({ node, ...props }) => react_1.default.createElement("pre", { ...props }, node.stack?.join('\n') || node.message);
SyntaxErrorHandler.displayName = "SyntaxErrorHandler";
exports.default = (0, componentify_1.default)(SyntaxErrorHandler);
