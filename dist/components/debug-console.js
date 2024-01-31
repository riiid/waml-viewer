"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const use_waml_1 = __importDefault(require("../use-waml"));
const react_2 = __importDefault(require("react"));
const DebugConsole = ({ document }) => {
    const { value } = (0, use_waml_1.default)();
    const [opened, setOpened] = (0, react_1.useState)(false);
    return react_2.default.createElement("div", { className: "DebugConsole" },
        opened && react_2.default.createElement("div", null,
            react_2.default.createElement("h1", null, "\uB2F5\uC548"),
            react_2.default.createElement("pre", null, JSON.stringify(value, null, 2)),
            react_2.default.createElement("h1", null, "\uBA54\uD0C0\uB370\uC774\uD130"),
            react_2.default.createElement("pre", null, JSON.stringify(document.metadata, null, 2)),
            react_2.default.createElement("h1", null, "AST"),
            react_2.default.createElement("pre", null, JSON.stringify(document.raw, null, 2))),
        react_2.default.createElement("button", { onClick: () => setOpened(!opened) }, opened ? "Close" : "Open console"));
};
exports.default = DebugConsole;
