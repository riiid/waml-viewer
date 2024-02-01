"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const componentify_1 = __importDefault(require("../componentify"));
const react_1 = __importDefault(require("react"));
const SyntaxErrorHandler = ({ node, ...props }) => {
    var _a;
    return react_1.default.createElement("pre", { ...props }, ((_a = node.stack) === null || _a === void 0 ? void 0 : _a.join('\n')) || node.message);
};
SyntaxErrorHandler.displayName = "SyntaxErrorHandler";
exports.default = (0, componentify_1.default)(SyntaxErrorHandler);
