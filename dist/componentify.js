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
const react_js_1 = require("./react.js");
const use_waml_js_1 = __importDefault(require("./use-waml.js"));
function componentify(Component) {
    const R = ({ node, ...props }) => {
        const { commonOptions, getComponentOptions } = (0, use_waml_js_1.default)();
        const componentOptions = getComponentOptions(Component.displayName);
        if (!commonOptions.noDefaultClassName) {
            Object.assign(props, { className: (0, react_js_1.C)(Component.displayName, props.className) });
        }
        if (typeof componentOptions === "function") {
            const children = Component({ node, ...props });
            return componentOptions({
                node,
                children: typeof children === "object" ? children === null || children === void 0 ? void 0 : children.props['children'] : null
            });
        }
        return react_1.default.createElement(Component, { node: node, ...props, ...componentOptions });
    };
    R.displayName = Component.displayName;
    return Object.assign((0, react_1.memo)(R), { displayName: R.displayName });
}
exports.default = componentify;
