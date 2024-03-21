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
    var _a, _b, _c;
    const $self = (0, react_1.useRef)(false);
    const { getButtonOptionByValue, draggingObject, setDraggingObject, interactionToken, logInteraction } = (0, use_waml_1.default)(true);
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
        (_a = draggingObject.callback) === null || _a === void 0 ? void 0 : _a.call(draggingObject, interactionToken);
        setPreview(undefined);
    }, [draggingObject, interactionToken, node.value, onPointerUp]);
    const handlePointerDown = (0, react_1.useCallback)(e => {
        // NOTE https://github.com/w3c/pointerevents/issues/178#issuecomment-1029108322
        e.target.releasePointerCapture(e.pointerId);
        const $target = e.currentTarget;
        // TODO ButtonOption을 value로 특정하는 방식은 value가 같은 ButtonOption의 처리를 곤란하게 만들고 있음. 번호를 이용하는 방식으로 바꿔야 함.
        // NOTE 번역 등 $target.textContent를 임의로 바꾸는 브라우저 기능에 의해 문제가 될 수 있음.
        const targetNode = getButtonOptionByValue($target.textContent, interactionToken.seq);
        if (!targetNode)
            throw Error(`Unexpected ButtonBlank value: ${$target.textContent}`);
        $self.current = true;
        logInteraction({ type: "button-option-down", value: $target.textContent, index: interactionToken.seq });
        setDraggingObject({
            displayName: "ButtonBlank",
            node: targetNode,
            e: e.nativeEvent,
            currentTarget: $target,
            callback: token => {
                const { seq, input, interactionValue } = token;
                if (seq === interactionToken.seq)
                    return;
                if (multiple || (input === null || input === void 0 ? void 0 : input.type) === "MULTIPLE" || !interactionValue) {
                    if (multiple)
                        interactionToken.handleInteract(targetNode.value);
                    else
                        interactionToken.unsetInteract();
                    logInteraction({ type: "button-blank-set", value: null, index: interactionToken.seq });
                }
                else {
                    interactionToken.handleInteract(interactionValue);
                    logInteraction({ type: "button-blank-set", value: interactionValue, index: interactionToken.seq });
                }
                token.handleInteract(targetNode.value, true);
                logInteraction({ type: "button-blank-set", value: targetNode.value, index: seq });
            }
        });
        e.preventDefault();
    }, [getButtonOptionByValue, interactionToken, logInteraction, multiple, setDraggingObject]);
    const handleClick = (0, react_1.useCallback)(e => {
        if (multiple) {
            interactionToken.handleInteract(e.currentTarget.textContent);
        }
        else {
            interactionToken.unsetInteract();
        }
        logInteraction({ type: "button-blank-set", value: null, index: interactionToken.seq });
    }, [interactionToken, logInteraction, multiple]);
    const $words = (_b = interactionToken.input) === null || _b === void 0 ? void 0 : _b.value.map((v, i) => {
        const dragging = (draggingObject === null || draggingObject === void 0 ? void 0 : draggingObject.node.kind) === "ButtonOption" && draggingObject.node.value === v;
        return (react_1.default.createElement("span", { key: i, onPointerDown: handlePointerDown, onClick: handleClick, translate: "no", "data-value": v, ...dragging ? { 'data-dragging': true } : {} }, v));
    });
    return react_1.default.createElement("span", { onPointerEnter: handlePointerEnter, onPointerLeave: handlePointerLeave, onPointerUp: handlePointerUp, translate: "no", ...props, ...preview ? { 'data-preview': true } : {}, ...(draggingObject === null || draggingObject === void 0 ? void 0 : draggingObject.node.kind) === "ButtonOption" && ((_c = interactionToken.input) === null || _c === void 0 ? void 0 : _c.value.includes(draggingObject.node.value)) ? { 'data-child-dragging': true } : {} },
        $words,
        multiple && Boolean(preview) && react_1.default.createElement("span", null, preview));
};
ButtonBlank.displayName = "ButtonBlank";
exports.default = (0, componentify_1.default)(ButtonBlank);
