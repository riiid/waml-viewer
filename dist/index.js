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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const waml_1 = require("@riiid/waml");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const react_2 = __importDefault(require("react"));
const builtin_style_1 = __importDefault(require("./components/builtin-style"));
const debug_console_1 = __importDefault(require("./components/debug-console"));
const document_1 = __importDefault(require("./components/document"));
const scoped_style_1 = __importDefault(require("./components/scoped-style"));
const syntax_error_handler_1 = __importDefault(require("./components/syntax-error-handler"));
const use_waml_1 = require("./use-waml");
const pairing_lines_1 = __importDefault(require("./components/pairing-lines"));
const defaultOptions = {};
const defaultMiddlewares = [];
const WAMLViewer = ({ waml, middlewares = defaultMiddlewares, options = defaultOptions, bare, defaultValue, value, onChange, onInteract, children, ...props }) => {
    const document = (0, react_1.useMemo)(() => {
        try {
            const R = typeof waml === "string" ? new waml_1.WAMLDocument(waml) : waml;
            for (const v of middlewares)
                v(R.raw, R.metadata);
            return R;
        }
        catch (error) {
            if (typeof waml === "string")
                return (0, waml_1.parseWAML)(waml);
            throw error;
        }
    }, [middlewares, waml]);
    const $explanations = (0, react_1.useMemo)(() => {
        if ('error' in document)
            return [];
        const R = [];
        for (const v of document.raw) {
            if (!(0, waml_1.hasKind)(v, 'XMLElement'))
                continue;
            if (v.tag !== "explanation")
                continue;
            R.push(react_2.default.createElement(document_1.default, { key: R.length, node: v.content }));
        }
        return R;
    }, [document]);
    const styles = (0, react_1.useMemo)(() => {
        if ('error' in document)
            return [];
        const R = [];
        for (const v of document.raw) {
            if (!(0, waml_1.hasKind)(v, 'XMLElement'))
                continue;
            if (v.tag !== "style")
                continue;
            R.push(v.content);
        }
        return R;
    }, [document]);
    if ('error' in document) {
        return react_2.default.createElement("article", { ...props },
            react_2.default.createElement(builtin_style_1.default, null, options.builtinCSS),
            react_2.default.createElement(use_waml_1.WAMLProvider, { document: document, options: options, value: value, defaultValue: defaultValue, onChange: onChange },
                react_2.default.createElement(syntax_error_handler_1.default, { node: document })));
    }
    if (bare) {
        return react_2.default.createElement(react_2.default.Fragment, null,
            styles.map((v, i) => (react_2.default.createElement(scoped_style_1.default, { key: i }, v))),
            react_2.default.createElement(document_1.default, { node: document.raw }));
    }
    return react_2.default.createElement("article", { ...props },
        react_2.default.createElement(builtin_style_1.default, null, options.builtinCSS),
        react_2.default.createElement(use_waml_1.WAMLProvider, { document: document, options: options, value: value, defaultValue: defaultValue, onChange: onChange, onInteract: onInteract },
            styles.map((v, i) => (react_2.default.createElement(scoped_style_1.default, { key: i }, v))),
            react_2.default.createElement(document_1.default, { node: document.raw }),
            react_2.default.createElement(pairing_lines_1.default, null),
            options.explanationWrapper
                ? (0, react_dom_1.createPortal)($explanations, options.explanationWrapper)
                : $explanations,
            children,
            options.debug && react_2.default.createElement(debug_console_1.default, { document: document })));
};
exports.default = WAMLViewer;
__exportStar(require("./types"), exports);
