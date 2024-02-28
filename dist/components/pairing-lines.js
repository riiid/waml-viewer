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
const use_waml_1 = __importDefault(require("../use-waml"));
const pairing_line_1 = __importDefault(require("./pairing-line"));
const PairingLines = () => {
    const { pairing, renderingVariables } = (0, use_waml_1.default)();
    const [lines, setLines] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        var _a, _b;
        const $lines = [];
        for (const k in pairing.pairedVertices) {
            for (const w of pairing.pairedVertices[k]) {
                // 양방향으로 있기 때문에 하나만 골라 그리면 됩니다.
                if (!('to' in w))
                    continue;
                const from = k;
                const to = w.to;
                const $from = (_a = renderingVariables.pairingOptionDots[from]) === null || _a === void 0 ? void 0 : _a[1];
                const $to = (_b = renderingVariables.pairingOptionDots[to]) === null || _b === void 0 ? void 0 : _b[0];
                if (!$from || !$to)
                    continue;
                $lines.push(react_1.default.createElement(pairing_line_1.default, { key: $lines.length, node: `${from}→${to}`, from: $from, to: $to }));
            }
        }
        setLines($lines);
    }, [pairing.pairedVertices, renderingVariables.pairingOptionDots]);
    return react_1.default.createElement("svg", { width: "100%", height: "100%", style: { position: "fixed", left: 0, top: 0, pointerEvents: "none" } }, lines);
};
exports.default = (0, react_1.memo)(PairingLines);
