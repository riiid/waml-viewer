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
const waml_1 = require("@riiid/waml");
const componentify_1 = __importDefault(require("../componentify"));
const line_component_1 = __importDefault(require("./line-component"));
const Line = (_a) => {
    var { node, next } = _a, props = __rest(_a, ["node", "next"]);
    if (node.component && (0, waml_1.hasKind)(node.component, 'Anchor')) {
        return null;
    }
    const anchored = (next === null || next === void 0 ? void 0 : next.component) && (0, waml_1.hasKind)(next.component, 'Anchor');
    return <div {...props} {...anchored ? { 'data-anchored': true } : {}}>
    <line_component_1.default node={node.component}/>
    {anchored && <line_component_1.default node={next.component}/>}
  </div>;
};
Line.displayName = "Line";
exports.default = (0, componentify_1.default)(Line);
