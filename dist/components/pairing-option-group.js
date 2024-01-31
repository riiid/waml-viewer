"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const pairing_option_1 = __importDefault(require("./pairing-option"));
const PairingOptionGroup = ({ node, ...props }) => react_1.default.createElement("ul", { ...props }, node.map(v => react_1.default.createElement(pairing_option_1.default, { key: v.cell.value, node: v })));
PairingOptionGroup.displayName = "PairingOptionGroup";
exports.default = (0, componentify_1.default)(PairingOptionGroup);
