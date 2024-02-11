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
const react_dom_1 = __importDefault(require("react-dom"));
const _1 = __importDefault(require("."));
const TestPage = () => {
    const [waml, setWAML] = (0, react_1.useState)("Hello, World!");
    // eslint-disable-next-line @jjoriping/variable-name
    const [explanationWrapper, setExplanationWrapper] = (0, react_1.useState)(null);
    const [x, setX] = (0, react_1.useState)();
    const handleChange = (0, react_1.useCallback)(e => setWAML(e.currentTarget.value), []);
    return react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("textarea", { value: waml, onChange: handleChange }),
        explanationWrapper && react_1.default.createElement(_1.default, { key: waml, waml: waml, options: {
                debug: true,
                explanationWrapper,
                prefixedLineClassMap: { "Test": "Good" },
                ChoiceOption: {
                    getter: node => ({ 'data-value': node.value })
                }
            }, value: x, onChange: value => setX(value) }),
        react_1.default.createElement("aside", { ref: setExplanationWrapper }));
};
react_dom_1.default.render(react_1.default.createElement(TestPage, null), document.querySelector("#stage"));
