"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const componentify_1 = __importDefault(require("../componentify"));
const HR = ({ node, ...props }) => react_1.default.createElement("hr", { ...props });
HR.displayName = "HR";
exports.default = (0, componentify_1.default)(HR);
