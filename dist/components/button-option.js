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
    const $ = (0, react_1.useRef)(null);
    const $ghost = (0, react_1.useRef)(null);
    const { draggingObject, setDraggingObject, checkButtonOptionUsed, renderingVariables } = (0, use_waml_1.default)();
    const used = checkButtonOptionUsed(node);
    const dragging = (draggingObject === null || draggingObject === void 0 ? void 0 : draggingObject.node) === node;
    const handlePointerDown = (0, react_1.useCallback)(e => {
        onPointerDown === null || onPointerDown === void 0 ? void 0 : onPointerDown(e);
        if (e.defaultPrevented)
            return;
        setDraggingObject({ displayName: "ButtonOption", node, e: e.nativeEvent, currentTarget: e.currentTarget });
    }, [node, onPointerDown, setDraggingObject]);
    renderingVariables.buttonOptions[node.id] = node;
    (0, react_1.useEffect)(() => {
        if ((draggingObject === null || draggingObject === void 0 ? void 0 : draggingObject.node) !== node)
            return;
        if (!$ghost.current)
            return;
        const $target = $ghost.current;
        const { e, currentTarget } = draggingObject;
        const rect = currentTarget.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;
        const onPointerMove = (f) => {
            f.preventDefault();
            $target.style.top = `${f.clientY}px`;
            $target.style.left = `${f.clientX}px`;
        };
        const onPointerUp = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            setDraggingObject(null);
        };
        $target.style.visibility = "visible";
        $target.style.transform = `translate(-${startX}px, -${startY}px)`;
        $target.style.top = `${e.clientY}px`;
        $target.style.left = `${e.clientX}px`;
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [draggingObject, node, setDraggingObject]);
    const R = react_1.default.createElement("button", { ref: $, disabled: used, onPointerDown: handlePointerDown, ...props, ...dragging ? { 'data-dragging': true } : {} }, node.value);
    return dragging
        ? react_1.default.createElement(react_1.default.Fragment, null,
            R,
            react_1.default.createElement("button", { ref: $ghost, ...props, "data-ghost": true }, node.value))
        : R;
};
ButtonOption.displayName = "ButtonOption";
exports.default = (0, componentify_1.default)(ButtonOption);
