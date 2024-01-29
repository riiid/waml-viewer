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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const waml_1 = require("@riiid/waml");
const waml_2 = require("@riiid/waml");
const waml_3 = require("@riiid/waml");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const use_waml_1 = require("./use-waml");
const syntax_error_handler_1 = __importDefault(require("./components/syntax-error-handler"));
const scoped_style_1 = __importDefault(require("./components/scoped-style"));
const debug_console_1 = __importDefault(require("./components/debug-console"));
const document_1 = __importDefault(require("./components/document"));
const builtin_style_1 = __importDefault(require("./components/builtin-style"));
const pairing_option_1 = __importDefault(require("./components/pairing-option"));
const pairing_option_list_1 = __importDefault(require("./components/pairing-option-list"));
const defaultOptions = {};
const defaultMiddlewares = [];
const WAMLViewer = (_a) => {
    var { waml, middlewares = defaultMiddlewares, options = defaultOptions, bare } = _a, props = __rest(_a, ["waml", "middlewares", "options", "bare"]);
    const document = (0, react_1.useMemo)(() => {
        try {
            const R = typeof waml === "string" ? new waml_3.WAMLDocument(waml) : waml;
            for (const v of middlewares)
                v(R.raw, R.metadata);
            return R;
        }
        catch (error) {
            if (typeof waml === "string")
                return (0, waml_3.parseWAML)(waml);
            throw error;
        }
    }, [middlewares, waml]);
    const $explanations = (0, react_1.useMemo)(() => {
        if ('error' in document)
            return [];
        const R = [];
        for (const v of document.raw) {
            if (!(0, waml_2.hasKind)(v, 'XMLElement'))
                continue;
            if (v.tag !== "explanation")
                continue;
            R.push(<document_1.default key={R.length} node={v.content}/>);
        }
        return R;
    }, [document]);
    const pairingGroups = (0, react_1.useMemo)(() => {
        var _a;
        if ('error' in document)
            return {};
        const R = {};
        const vertexGroups = {};
        for (const v of document.raw) {
            if (!(0, waml_2.hasKind)(v, 'Line'))
                continue;
            if (!v.component || !(0, waml_2.hasKind)(v.component, 'PairingOption'))
                continue;
            const $baby = <pairing_option_1.default key={v.component.cell.value} node={v.component}/>;
            let key;
            if (v.component.cell.inbound.length) {
                key = `${v.component.cell.inbound[0].name}/next`;
            }
            else {
                key = `${v.component.cell.outbound[0].name}/prev`;
            }
            (_a = vertexGroups[key]) !== null && _a !== void 0 ? _a : (vertexGroups[key] = []);
            vertexGroups[key].push($baby);
        }
        for (const v of document.metadata.answerFormat.interactions) {
            if (v.type !== waml_1.WAML.InteractionType.PAIRING_NET) {
                continue;
            }
            const prevVertices = vertexGroups[`${v.name}/prev`];
            const nextVertices = vertexGroups[`${v.name}/next`];
            if (prevVertices === null || prevVertices === void 0 ? void 0 : prevVertices.length)
                R[v.fromValues[0]] = <pairing_option_list_1.default key="prev" node={prevVertices}/>;
            if (nextVertices === null || nextVertices === void 0 ? void 0 : nextVertices.length)
                R[v.toValues[0]] = <pairing_option_list_1.default key="next" node={nextVertices}/>;
        }
        return R;
    }, [document]);
    const styles = (0, react_1.useMemo)(() => {
        if ('error' in document)
            return [];
        const R = [];
        for (const v of document.raw) {
            if (!(0, waml_2.hasKind)(v, 'XMLElement'))
                continue;
            if (v.tag !== "style")
                continue;
            R.push(v.content);
        }
        return R;
    }, [document]);
    if ('error' in document) {
        return <article {...props}>
      <builtin_style_1.default />
      <use_waml_1.WAMLProvider document={document} options={options} pairingGroups={pairingGroups}>
        <syntax_error_handler_1.default node={document}/>
      </use_waml_1.WAMLProvider>
    </article>;
    }
    if (bare) {
        return <>
      {styles.map((v, i) => (<scoped_style_1.default key={i}>{v}</scoped_style_1.default>))}
      <document_1.default node={document.raw}/>
    </>;
    }
    return <article {...props}>
    <builtin_style_1.default />
    <use_waml_1.WAMLProvider document={document} options={options} pairingGroups={pairingGroups}>
      {styles.map((v, i) => (<scoped_style_1.default key={i}>{v}</scoped_style_1.default>))}
      <document_1.default node={document.raw}/>
      {options.explanationWrapper
            ? (0, react_dom_1.createPortal)($explanations, options.explanationWrapper)
            : $explanations}
      {options.debug && <debug_console_1.default document={document}/>}
    </use_waml_1.WAMLProvider>
  </article>;
};
exports.default = WAMLViewer;
