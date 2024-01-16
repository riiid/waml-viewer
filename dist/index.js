"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_dev_runtime_1 = require("react/jsx-dev-runtime");
const _jsxFileName = "C:/Users/dosel/Dev/waml-viewer/src/index.tsx";
const waml_1 = require("@riiid/waml");
const react_1 = require("react");
const use_waml_1 = require("./use-waml");
const WAMLViewer = (_a) => {
    var _b;
    var { waml } = _a, props = __rest(_a, ["waml"]);
    const document = (0, react_1.useMemo)(() => {
        try {
            return new waml_1.WAMLDocument(waml);
        }
        catch (error) {
            return (0, waml_1.parseWAML)(waml);
        }
    }, [waml]);
    if ('error' in document) {
        return (0, jsx_dev_runtime_1.jsxDEV)("article", Object.assign({}, props, { children: (0, jsx_dev_runtime_1.jsxDEV)("pre", { children: ((_b = document.stack) === null || _b === void 0 ? void 0 : _b.join('\n')) || document.message }, void 0, false, { fileName: _jsxFileName, lineNumber: 21, columnNumber: 7 }, this) }), void 0, false, { fileName: _jsxFileName, lineNumber: 20, columnNumber: 11 }, this);
    }
    return (0, jsx_dev_runtime_1.jsxDEV)("article", Object.assign({}, props, { children: (0, jsx_dev_runtime_1.jsxDEV)(use_waml_1.WAMLProvider, { document: document, children: [(0, jsx_dev_runtime_1.jsxDEV)("h2", { children: "Hello, World!" }, void 0, false, { fileName: _jsxFileName, lineNumber: 26, columnNumber: 7 }, this), (0, jsx_dev_runtime_1.jsxDEV)("pre", { children: JSON.stringify(document, null, 2) }, void 0, false, { fileName: _jsxFileName, lineNumber: 27, columnNumber: 7 }, this)] }, void 0, true, { fileName: _jsxFileName, lineNumber: 25, columnNumber: 5 }, this) }), void 0, false, { fileName: _jsxFileName, lineNumber: 24, columnNumber: 9 }, this);
};
exports.default = WAMLViewer;
