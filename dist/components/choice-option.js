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
const componentify_1 = __importDefault(require("../componentify"));
const use_waml_1 = __importDefault(require("../use-waml"));
const ChoiceOption = ({ node, onInteract, ...props }) => {
    const { interactionToken } = (0, use_waml_1.default)(true);
    const handleChange = (0, react_1.useCallback)(() => {
        interactionToken.handleInteract(interactionToken.interactionValue);
    }, [interactionToken]);
    (0, react_1.useEffect)(() => {
        onInteract === null || onInteract === void 0 ? void 0 : onInteract(interactionToken.selected);
    }, [interactionToken.selected, onInteract]);
    return react_1.default.createElement("span", { ...props },
        react_1.default.createElement("input", { type: "checkbox", checked: interactionToken.selected, onChange: handleChange }),
        react_1.default.createElement("i", null, node.value));
};
ChoiceOption.displayName = "ChoiceOption";
exports.default = (0, componentify_1.default)(ChoiceOption);
