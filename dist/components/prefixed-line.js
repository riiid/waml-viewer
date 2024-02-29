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
const react_2 = require("../react");
const use_waml_1 = __importDefault(require("../use-waml"));
const isoprefixed_line_group_renderer_1 = __importDefault(require("./isoprefixed-line-group-renderer"));
const PrefixedLine = ({ node, type, depth, className, ...props }) => {
    const $ = (0, react_1.useRef)(null);
    const { renderingVariables, commonOptions } = (0, use_waml_1.default)();
    const [hasButtonBlank, setHasButtonBlank] = (0, react_1.useState)(false);
    const pendingClassName = (0, react_1.useMemo)(() => {
        var _a;
        let R = renderingVariables.pendingClasses.pop();
        if (R && ((_a = commonOptions.prefixedLineClassMap) === null || _a === void 0 ? void 0 : _a[R])) {
            R = commonOptions.prefixedLineClassMap[R];
        }
        return R;
    }, [commonOptions.prefixedLineClassMap, renderingVariables.pendingClasses]);
    (0, react_1.useLayoutEffect)(() => {
        var _a;
        if ((_a = $.current) === null || _a === void 0 ? void 0 : _a.querySelector(".ButtonBlank")) {
            setHasButtonBlank(true);
        }
    }, []);
    return (react_1.default.createElement("div", { ref: $, className: (0, react_2.C)(className, type, pendingClassName), ...props, ...hasButtonBlank ? { 'data-has-button-blank': true } : {} },
        react_1.default.createElement(isoprefixed_line_group_renderer_1.default, { depth: depth, lines: node })));
};
PrefixedLine.displayName = "PrefixedLine";
exports.default = (0, componentify_1.default)(PrefixedLine);
