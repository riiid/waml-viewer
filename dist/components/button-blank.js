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
const utility_1 = require("../utility");
const ButtonBlank = ({ node, onPointerEnter, onPointerLeave, onPointerUp, ...props }) => {
    var _a, _b;
    const $self = (0, react_1.useRef)(false);
    const { getButtonOptionByValue, draggingObject, setDraggingObject, interactionToken } = (0, use_waml_1.default)(true);
    const [preview, setPreview] = (0, react_1.useState)();
    const multiple = ((_a = interactionToken.input) === null || _a === void 0 ? void 0 : _a.type) === "MULTIPLE";
    const handlePointerEnter = (0, react_1.useCallback)(e => {
        onPointerEnter === null || onPointerEnter === void 0 ? void 0 : onPointerEnter(e);
        if (e.defaultPrevented)
            return;
        if (!draggingObject)
            return;
        if (!(0, waml_1.hasKind)(draggingObject.node, 'ButtonOption'))
            return;
        if (!(0, utility_1.getIntersection)(draggingObject.node.group, node.value).length)
            return;
        $self.current = false;
        setPreview(draggingObject.node.value);
    }, [draggingObject, node.value, onPointerEnter]);
    const handlePointerLeave = (0, react_1.useCallback)(e => {
        onPointerLeave === null || onPointerLeave === void 0 ? void 0 : onPointerLeave(e);
        if (e.defaultPrevented)
            return;
        if (!draggingObject)
            return;
        setPreview(undefined);
    }, [draggingObject, onPointerLeave]);
    const handlePointerUp = (0, react_1.useCallback)(e => {
        var _a;
        onPointerUp === null || onPointerUp === void 0 ? void 0 : onPointerUp(e);
        if (e.defaultPrevented)
            return;
        if (!draggingObject)
            return;
        if (!(0, waml_1.hasKind)(draggingObject.node, 'ButtonOption'))
            return;
        if (!(0, utility_1.getIntersection)(draggingObject.node.group, node.value).length)
            return;
        if ($self.current)
            return;
        (_a = draggingObject.callback) === null || _a === void 0 ? void 0 : _a.call(draggingObject);
        interactionToken.handleInteract(draggingObject.node.value, true);
        setPreview(undefined);
    }, [draggingObject, interactionToken, node, onPointerUp]);
    const handlePointerDown = (0, react_1.useCallback)(e => {
        const $target = e.currentTarget;
        const targetNode = getButtonOptionByValue($target.textContent);
        if (!targetNode)
            throw Error(`Unexpected ButtonBlank value: ${$target.textContent}`);
        $self.current = true;
        setDraggingObject({
            displayName: "ButtonBlank",
            node: targetNode,
            e: e.nativeEvent,
            callback: () => {
                if (multiple) {
                    interactionToken.handleInteract($target.textContent);
                }
                else {
                    interactionToken.unsetInteract();
                }
            }
        });
    }, [getButtonOptionByValue, interactionToken, multiple, setDraggingObject]);
    const handleClick = (0, react_1.useCallback)(e => {
        if (multiple) {
            interactionToken.handleInteract(e.currentTarget.textContent);
        }
        else {
            interactionToken.unsetInteract();
        }
    }, [interactionToken, multiple]);
    return react_1.default.createElement("span", { onPointerEnter: handlePointerEnter, onPointerLeave: handlePointerLeave, onPointerUp: handlePointerUp, ...props, ...preview ? { 'data-preview': true } : {} },
        (multiple || !preview) && ((_b = interactionToken.input) === null || _b === void 0 ? void 0 : _b.value.map((v, i) => (react_1.default.createElement("span", { key: i, onPointerDown: handlePointerDown, onClick: handleClick, ...(draggingObject === null || draggingObject === void 0 ? void 0 : draggingObject.node.kind) === "ButtonOption" && draggingObject.node.value === v ? { 'data-dragging': true } : {} }, v)))),
        Boolean(preview) && react_1.default.createElement("span", null, preview));
};
ButtonBlank.displayName = "ButtonBlank";
exports.default = (0, componentify_1.default)(ButtonBlank);
