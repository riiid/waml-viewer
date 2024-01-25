"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const componentify_1 = __importDefault(require("../componentify"));
const inline_1 = __importDefault(require("./inline"));
const FigureAddon = ({ node }) => {
    const children = node.inlines.map((v, i) => <inline_1.default key={i} node={v}/>);
    switch (node.type) {
        case "title":
            return <em>{children}</em>;
        case "caption":
            return <small>{children}</small>;
    }
};
FigureAddon.displayName = "FigureAddon";
exports.default = (0, componentify_1.default)(FigureAddon);
