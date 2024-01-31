"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const inline_1 = __importDefault(require("./inline"));
const PairingOption = ({ node, ...props }) => react_1.default.createElement("li", { ...props },
    node.cell.inbound.length > 0 && react_1.default.createElement("input", { type: "radio", readOnly: true }),
    node.inlines.map((v, i) => react_1.default.createElement(inline_1.default, { key: i, node: v })),
    node.cell.outbound.length > 0 && react_1.default.createElement("input", { type: "radio", readOnly: true }));
PairingOption.displayName = "PairingOption";
exports.default = (0, componentify_1.default)(PairingOption);
