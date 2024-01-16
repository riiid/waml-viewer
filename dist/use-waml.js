"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAMLProvider = void 0;
const jsx_dev_runtime_1 = require("react/jsx-dev-runtime");
const _jsxFileName = "C:/Users/dosel/Dev/waml-viewer/src/use-waml.tsx";
const react_1 = require("react");
const context = (0, react_1.createContext)(null);
const useWAML = () => (0, react_1.useContext)(context);
exports.default = useWAML;
const WAMLProvider = ({ document, children }) => {
    const value = (0, react_1.useMemo)(() => ({
        metadata: document.metadata
    }), [document.metadata]);
    return (0, jsx_dev_runtime_1.jsxDEV)(context.Provider, { value: value, children: children }, void 0, false, { fileName: _jsxFileName, lineNumber: 21, columnNumber: 9 }, this);
};
exports.WAMLProvider = WAMLProvider;
