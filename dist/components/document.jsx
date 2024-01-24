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
const react_1 = require("react");
const waml_1 = require("@riiid/waml");
const componentify_1 = __importDefault(require("../componentify"));
const waml_error_1 = __importDefault(require("../waml-error"));
const semantic_error_handler_1 = __importDefault(require("./semantic-error-handler"));
const Document = (_a) => {
    var { node } = _a, props = __rest(_a, ["node"]);
    const lines = (0, react_1.useMemo)(() => {
        const R = [];
        let lastMeaningfulLineIndex = 0;
        for (const v of node) {
            if (!(0, waml_1.hasKind)(v, 'Line'))
                continue;
            R.push(v);
            if (v.component === null)
                continue;
            if ((0, waml_1.hasKind)(v.component, 'Directive'))
                continue;
            lastMeaningfulLineIndex = R.length - 1;
        }
        return R.slice(0, lastMeaningfulLineIndex + 1);
    }, [node]);
    return <WAMLErrorBoundary document={node}>
    <section {...props}>
      {JSON.stringify(lines, null, 2)}
    </section>
  </WAMLErrorBoundary>;
};
Document.displayName = "Document";
exports.default = (0, componentify_1.default)(Document);
// eslint-disable-next-line react/require-optimization
class WAMLErrorBoundary extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { error: undefined };
    }
    componentDidCatch(error) {
        if (error instanceof waml_error_1.default) {
            this.setState({ error });
        }
        else {
            throw error;
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.document !== this.props.document) {
            this.setState({ error: undefined });
        }
    }
    render() {
        if (this.state.error) {
            return <semantic_error_handler_1.default node={this.state.error}/>;
        }
        return this.props.children;
    }
}
