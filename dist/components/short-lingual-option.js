"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const componentify_1 = __importDefault(require("../componentify"));
const use_waml_1 = __importDefault(require("../use-waml"));
const react_2 = __importDefault(require("react"));
const ShortLingualOption = ({ node, inline, ...props }) => {
    const { interactionToken } = (0, use_waml_1.default)(true);
    const handleChange = (0, react_1.useCallback)(e => {
        interactionToken.handleInteract(e.currentTarget.value);
    }, [interactionToken]);
    return react_2.default.createElement("input", { type: "text", value: interactionToken.interactionValue, onChange: handleChange, ...inline ? { 'data-inline': true } : {}, ...node.defaultValue ? { defaultValue: node.value } : { placeholder: node.value }, ...props });
};
ShortLingualOption.displayName = "ShortLingualOption";
exports.default = (0, componentify_1.default)(ShortLingualOption);
