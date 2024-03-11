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
const waml_1 = require("@riiid/waml");
const componentify_1 = __importDefault(require("../componentify"));
const waml_error_1 = __importDefault(require("../waml-error"));
const use_waml_1 = __importDefault(require("../use-waml"));
const semantic_error_handler_1 = __importDefault(require("./semantic-error-handler"));
const isoprefixed_line_group_renderer_1 = __importDefault(require("./isoprefixed-line-group-renderer"));
const Document = ({ node, children, ...props }) => {
    const { draggingObject } = (0, use_waml_1.default)();
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
    return react_1.default.createElement(WAMLErrorBoundary, { document: node },
        react_1.default.createElement("section", { ...props, ...draggingObject ? { 'data-dragging': true } : {} },
            react_1.default.createElement(isoprefixed_line_group_renderer_1.default, { lines: lines }),
            children));
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
            return react_1.default.createElement(semantic_error_handler_1.default, { node: this.state.error });
        }
        return this.props.children;
    }
}
