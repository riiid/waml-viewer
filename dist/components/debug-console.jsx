"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const use_waml_1 = __importDefault(require("../use-waml"));
const DebugConsole = ({ document }) => {
    const { value } = (0, use_waml_1.default)();
    const [opened, setOpened] = (0, react_1.useState)(false);
    return <div className="DebugConsole">
    {opened && <div>
      <h1>답안</h1>
      <pre>{JSON.stringify(value, null, 2)}</pre>
      <h1>메타데이터</h1>
      <pre>{JSON.stringify(document.metadata, null, 2)}</pre>
      <h1>AST</h1>
      <pre>{JSON.stringify(document.raw, null, 2)}</pre>
    </div>}
    <button onClick={() => setOpened(!opened)}>
      {opened ? "Close" : "Open console"}
    </button>
  </div>;
};
exports.default = DebugConsole;
