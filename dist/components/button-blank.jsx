"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const componentify_1 = __importDefault(require("../componentify"));
const use_waml_1 = __importDefault(require("../use-waml"));
const utility_1 = require("../utility");
const ButtonBlank = (_a) => {
    var _b, _c;
    var { node, onPointerEnter, onPointerLeave, onPointerUp } = _a, props = __rest(_a, ["node", "onPointerEnter", "onPointerLeave", "onPointerUp"]);
    const { draggingObject, interactionToken } = (0, use_waml_1.default)(true);
    const [preview, setPreview] = (0, react_1.useState)();
    const multiple = ((_b = interactionToken.input) === null || _b === void 0 ? void 0 : _b.type) === "MULTIPLE";
    const handlePointerEnter = (0, react_1.useCallback)(e => {
        onPointerEnter === null || onPointerEnter === void 0 ? void 0 : onPointerEnter(e);
        if (e.defaultPrevented)
            return;
        if (!draggingObject)
            return;
        if (!(0, utility_1.getIntersection)(draggingObject.node.group, node.value).length)
            return;
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
        onPointerUp === null || onPointerUp === void 0 ? void 0 : onPointerUp(e);
        if (e.defaultPrevented)
            return;
        if (!draggingObject)
            return;
        if (!(0, utility_1.getIntersection)(draggingObject.node.group, node.value).length)
            return;
        interactionToken.handleInteract(draggingObject.node.value);
        setPreview(undefined);
    }, [draggingObject, interactionToken, node.value, onPointerUp]);
    const handleClick = (0, react_1.useCallback)(e => {
        if (multiple) {
            interactionToken.handleInteract(e.currentTarget.textContent);
        }
        else {
            interactionToken.unsetInteract();
        }
    }, [interactionToken, multiple]);
    return <span onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} onPointerUp={handlePointerUp} {...props} {...preview ? { 'data-preview': true } : {}}>
    {(multiple || !preview) && ((_c = interactionToken.input) === null || _c === void 0 ? void 0 : _c.value.map((v, i) => (<span key={i} onClick={handleClick}>{v}</span>)))}
    {Boolean(preview) && <span>{preview}</span>}
  </span>;
};
ButtonBlank.displayName = "ButtonBlank";
exports.default = (0, componentify_1.default)(ButtonBlank);
