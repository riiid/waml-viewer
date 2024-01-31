"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const use_waml_1 = __importDefault(require("../use-waml"));
const Video = ({ node, ...props }) => {
    const { getURL } = (0, use_waml_1.default)();
    return react_1.default.createElement("video", { title: node.value.alt, src: getURL(node.value.uri), controls: true, ...props });
};
Video.displayName = "Video";
exports.default = (0, componentify_1.default)(Video);
