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
const ButtonOption = ({ node, onPointerDown, ...props }) => {
    const { draggingObject, setDraggingObject, checkButtonOptionUsed } = (0, use_waml_1.default)();
    const used = checkButtonOptionUsed(node);
    const handlePointerDown = (0, react_1.useCallback)(e => {
        onPointerDown?.(e);
        if (e.defaultPrevented)
            return;
        const $target = e.currentTarget;
        const startX = e.clientX;
        const startY = e.clientY;
        const { top, left } = $target.getBoundingClientRect();
        const onPointerMove = (f) => {
            const deltaX = f.clientX - startX;
            const deltaY = f.clientY - startY;
            $target.style.top = `${top + deltaY}px`;
            $target.style.left = `${left + deltaX}px`;
        };
        const onPointerUp = () => {
            $target.style.top = "";
            $target.style.left = "";
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            setDraggingObject(null);
        };
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        setDraggingObject({ displayName: "ButtonOption", node, $target });
    }, [node, onPointerDown, setDraggingObject]);
    return react_1.default.createElement("button", { disabled: used, onPointerDown: handlePointerDown, ...props, ...node.id === draggingObject?.node.id ? { 'data-dragging': true } : {} }, node.value);
};
ButtonOption.displayName = "ButtonOption";
exports.default = (0, componentify_1.default)(ButtonOption);
