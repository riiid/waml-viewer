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
const componentify_1 = __importDefault(require("../componentify"));
const ShortLingualOption = (_a) => {
    var { node, inline } = _a, props = __rest(_a, ["node", "inline"]);
    return <input type="text" {...inline ? { 'data-inline': true } : {}} {...node.defaultValue ? { defaultValue: node.value } : { placeholder: node.value }} {...props}/>;
};
ShortLingualOption.displayName = "ShortLingualOption";
exports.default = (0, componentify_1.default)(ShortLingualOption);
