"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_dev_runtime_1 = require("react/jsx-dev-runtime");
const _jsxFileName = "C:/Users/dosel/Dev/waml-viewer/src/index.tsx";
const react_1 = require("react");
const waml_1 = require("@riiid/waml");
const WAMLViewer = ({ waml }) => {
    const [currentError, setCurrentError] = (0, react_1.useState)();
    const document = (0, react_1.useMemo)(() => {
        try {
            const R = new waml_1.WAMLDocument(waml);
            setCurrentError(undefined);
            return R;
        }
        catch (error) {
            if (error instanceof Error)
                console.warn(error.stack);
            setCurrentError(String(error));
            return undefined;
        }
    }, [waml]);
    if (currentError) {
        return (0, jsx_dev_runtime_1.jsxDEV)("article", { children: currentError }, void 0, false, { fileName: _jsxFileName, lineNumber: 24, columnNumber: 11 }, this);
    }
    return (0, jsx_dev_runtime_1.jsxDEV)("article", { children: [(0, jsx_dev_runtime_1.jsxDEV)("h2", { children: "Hello, World!" }, void 0, false, { fileName: _jsxFileName, lineNumber: 27, columnNumber: 5 }, this), (0, jsx_dev_runtime_1.jsxDEV)("pre", { children: JSON.stringify(document, null, 2) }, void 0, false, { fileName: _jsxFileName, lineNumber: 28, columnNumber: 5 }, this)] }, void 0, true, { fileName: _jsxFileName, lineNumber: 26, columnNumber: 9 }, this);
};
exports.default = WAMLViewer;
