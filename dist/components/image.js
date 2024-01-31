"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const use_waml_1 = __importDefault(require("../use-waml"));
const Image = ({ node, ...props }) => {
    const { getURL } = (0, use_waml_1.default)();
    return react_1.default.createElement("img", { alt: node.value.alt, src: getURL(node.value.uri), ...props });
};
Image.displayName = "Image";
exports.default = (0, componentify_1.default)(Image);
