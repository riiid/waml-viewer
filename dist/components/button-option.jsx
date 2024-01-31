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
const ButtonOption = (_a) => {
    var { node, onPointerDown } = _a, props = __rest(_a, ["node", "onPointerDown"]);
    const { draggingObject, setDraggingObject, checkButtonOptionUsed } = (0, use_waml_1.default)();
    const used = checkButtonOptionUsed(node);
    const handlePointerDown = (0, react_1.useCallback)(e => {
        onPointerDown === null || onPointerDown === void 0 ? void 0 : onPointerDown(e);
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
    return <button disabled={used} onPointerDown={handlePointerDown} {...props} {...node.id === (draggingObject === null || draggingObject === void 0 ? void 0 : draggingObject.node.id) ? { 'data-dragging': true } : {}}>
    {node.value}
  </button>;
};
ButtonOption.displayName = "ButtonOption";
exports.default = (0, componentify_1.default)(ButtonOption);
