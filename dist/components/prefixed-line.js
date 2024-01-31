"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const react_2 = require("../react");
const use_waml_1 = __importDefault(require("../use-waml"));
const isoprefixed_line_group_renderer_1 = __importDefault(require("./isoprefixed-line-group-renderer"));
const PrefixedLine = ({ node, type, depth, className, ...props }) => {
    const { renderingVariables } = (0, use_waml_1.default)();
    return (react_1.default.createElement("div", { className: (0, react_2.C)(className, type, renderingVariables.pendingClasses.pop()), ...props },
        react_1.default.createElement(isoprefixed_line_group_renderer_1.default, { depth: depth, lines: node })));
};
PrefixedLine.displayName = "PrefixedLine";
exports.default = (0, componentify_1.default)(PrefixedLine);
