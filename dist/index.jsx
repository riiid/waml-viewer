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
        return <article {...props}>
      <pre>{((_b = document.stack) === null || _b === void 0 ? void 0 : _b.join('\n')) || document.message}</pre>
    </article>;
    }
    return <article {...props}>
    <use_waml_1.WAMLProvider document={document}>
      <h2>Hello, World!</h2>
      <pre>
        {JSON.stringify(document, null, 2)}
      </pre>
    </use_waml_1.WAMLProvider>
  </article>;
};
exports.default = WAMLViewer;
