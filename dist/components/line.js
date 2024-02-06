"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const waml_1 = require("@riiid/waml");
const react_1 = __importDefault(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const line_component_1 = __importDefault(require("./line-component"));
const Line = ({ node, next, ...props }) => {
    if (node.component && (0, waml_1.hasKind)(node.component, 'Anchor')) {
        return null;
    }
    if (node.component && (0, waml_1.hasKind)(node.component, 'LineComponent') && node.component.headOption) {
        return react_1.default.createElement(line_component_1.default, { node: node.component });
    }
    const anchored = (next === null || next === void 0 ? void 0 : next.component) && (0, waml_1.hasKind)(next.component, 'Anchor');
    return react_1.default.createElement("div", { ...props, ...anchored ? { 'data-anchored': true } : {} },
        react_1.default.createElement(line_component_1.default, { node: node.component }),
        anchored && react_1.default.createElement(line_component_1.default, { node: next.component }));
};
Line.displayName = "Line";
exports.default = (0, componentify_1.default)(Line);
