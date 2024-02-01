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
const inline_1 = __importDefault(require("./inline"));
const PairingOption = ({ node, onClick, ...props }) => {
    var _a, _b;
    const { draggingObject, setDraggingObject, pairing, setFlattenValue } = (0, use_waml_1.default)();
    const { refInbound, refOutbound } = pairing.getDotRefs(node);
    const dragging = (draggingObject === null || draggingObject === void 0 ? void 0 : draggingObject.node) === node;
    const inboundPaired = ((_a = pairing.pairedVertices[node.cell.value]) === null || _a === void 0 ? void 0 : _a.some(v => 'from' in v)) || false;
    const outboundPaired = ((_b = pairing.pairedVertices[node.cell.value]) === null || _b === void 0 ? void 0 : _b.some(v => 'to' in v)) || false;
    const handleClick = (0, react_1.useCallback)(e => {
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
        if (e.defaultPrevented)
            return;
        if (draggingObject) {
            setDraggingObject(null);
            if (!(0, waml_1.hasKind)(draggingObject.node, 'PairingOption'))
                return;
            const draggingNode = draggingObject.node;
            setFlattenValue((prev, interactions) => {
                const [netIndex, actualValue] = pairing.getNetIndexByEdge(draggingNode.cell.value, node.cell.value);
                const net = netIndex === -1 ? undefined : interactions[netIndex];
                if ((net === null || net === void 0 ? void 0 : net.type) !== waml_1.WAML.InteractionType.PAIRING_NET)
                    return false;
                const [from, to] = actualValue.split('→');
                const fromNet = (draggingNode.cell.value === from
                    ? draggingNode.cell
                    : node.cell).outbound.find(v => v.name === net.name);
                const toNet = (draggingNode.cell.value === to
                    ? draggingNode.cell
                    : node.cell).inbound.find(v => v.name === net.name);
                const next = [...prev];
                if (prev[netIndex]) {
                    next[netIndex] = {
                        type: "MULTIPLE",
                        ordered: false,
                        value: prev[netIndex].value.filter(v => {
                            if (v.startsWith(`${from}→`) && !(fromNet === null || fromNet === void 0 ? void 0 : fromNet.multiple))
                                return false;
                            if (v.endsWith(`→${to}`) && !(toNet === null || toNet === void 0 ? void 0 : toNet.multiple))
                                return false;
                            if (v === actualValue)
                                return false;
                            return true;
                        })
                    };
                    next[netIndex].value.push(actualValue);
                }
                else {
                    next[netIndex] = { type: "MULTIPLE", ordered: false, value: [actualValue] };
                }
                return next;
            });
        }
        else {
            setDraggingObject({
                $target: e.currentTarget,
                displayName: "PairingOption",
                node
            });
        }
    }, [draggingObject, node, onClick, pairing, setDraggingObject, setFlattenValue]);
    return react_1.default.createElement("li", { onClick: handleClick, ...props, ...dragging ? { 'data-dragging': true } : {} },
        node.cell.inbound.length > 0 && react_1.default.createElement("input", { ref: refInbound, type: "radio", checked: inboundPaired, readOnly: true }),
        node.inlines.map((v, i) => react_1.default.createElement(inline_1.default, { key: i, node: v })),
        node.cell.outbound.length > 0 && react_1.default.createElement("input", { ref: refOutbound, type: "radio", checked: outboundPaired, readOnly: true }));
};
PairingOption.displayName = "PairingOption";
exports.default = (0, componentify_1.default)(PairingOption);
