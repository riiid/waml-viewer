"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_dev_runtime_1 = require("react/jsx-dev-runtime");
const _jsxFileName = "C:/Users/dosel/Dev/waml-viewer/src/test.tsx";
const react_1 = require("react");
const react_dom_1 = __importDefault(require("react-dom"));
const _1 = __importDefault(require("."));
const TestPage = () => {
    const [waml, setWAML] = (0, react_1.useState)("Hello, World!");
    const handleChange = (0, react_1.useCallback)(e => setWAML(e.currentTarget.value), []);
    return (0, jsx_dev_runtime_1.jsxDEV)(jsx_dev_runtime_1.Fragment, { children: [(0, jsx_dev_runtime_1.jsxDEV)("textarea", { value: waml, onChange: handleChange }, void 0, false, { fileName: _jsxFileName, lineNumber: 15, columnNumber: 5 }, this), (0, jsx_dev_runtime_1.jsxDEV)(_1.default, { waml: waml }, void 0, false, { fileName: _jsxFileName, lineNumber: 16, columnNumber: 5 }, this)] }, void 0, true, { fileName: _jsxFileName, lineNumber: 14, columnNumber: 9 }, this);
};
react_dom_1.default.render((0, jsx_dev_runtime_1.jsxDEV)(TestPage, {}, void 0, false, { fileName: _jsxFileName, lineNumber: 19, columnNumber: 17 }, this), document.querySelector("#stage"));
