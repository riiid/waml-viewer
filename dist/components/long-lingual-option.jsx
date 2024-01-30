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
const LongLingualOption = (_a) => {
    var { node } = _a, props = __rest(_a, ["node"]);
    const { interactionToken } = (0, use_waml_1.default)(true);
    const handleChange = (0, react_1.useCallback)(e => {
        interactionToken.handleInteract(e.currentTarget.value);
    }, [interactionToken]);
    return <textarea placeholder={node.value} value={interactionToken.interactionValue} onChange={handleChange} {...props}/>;
};
LongLingualOption.displayName = "LongLingualOption";
exports.default = (0, componentify_1.default)(LongLingualOption);
