"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const ScopedStyle = ({ children }) => {
    // NOTE 서버 사이드에서 바로 렌더링하는 경우 `>` 등 일부 문자에 대해 hydration 오류가 생긴다.
    const handleRef = (0, react_2.useCallback)(($) => {
        if (!$)
            return;
        $.textContent = children;
    }, [children]);
    return react_1.default.createElement("style", { ref: handleRef, scoped: true });
};
exports.default = (0, react_2.memo)(ScopedStyle);
