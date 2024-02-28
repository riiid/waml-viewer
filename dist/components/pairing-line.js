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
const use_waml_1 = __importDefault(require("../use-waml"));
const PairingLine = ({ node, from, to, onClick, style, ...props }) => {
    const { setFlattenValue } = (0, use_waml_1.default)();
    // eslint-disable-next-line react/hook-use-state
    const [, setCounter] = (0, react_1.useState)(0);
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const handleClick = (0, react_1.useCallback)(e => {
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
        if (e.defaultPrevented)
            return;
        setFlattenValue((prev, interactions) => {
            const next = [...prev];
            for (const v of interactions) {
                if (v.type !== waml_1.WAML.InteractionType.PAIRING_NET)
                    continue;
                if (!prev[v.index])
                    continue;
                next[v.index] = {
                    type: "MULTIPLE",
                    ordered: false,
                    value: prev[v.index].value.filter(w => w !== node)
                };
            }
            return next;
        });
    }, [node, onClick, setFlattenValue]);
    (0, react_1.useEffect)(() => {
        const timer = window.setInterval(() => {
            setCounter(prev => prev + 1);
        }, 30);
        return () => window.clearInterval(timer);
    }, []);
    return react_1.default.createElement("line", { ...props, style: { pointerEvents: "all", ...style }, onClick: handleClick, x1: fromRect.left + 0.5 * fromRect.width, y1: fromRect.top + 0.5 * fromRect.height, x2: toRect.left + 0.5 * toRect.width, y2: toRect.top + 0.5 * toRect.height });
};
PairingLine.displayName = "PairingLine";
exports.default = (0, componentify_1.default)(PairingLine);
