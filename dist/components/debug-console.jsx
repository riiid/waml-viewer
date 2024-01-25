"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DebugConsole = ({ document }) => {
    const [opened, setOpened] = (0, react_1.useState)(false);
    return <div className="DebugConsole">
    {opened && <div>
      <pre>{JSON.stringify(document.raw, null, 2)}</pre>
    </div>}
    <button onClick={() => setOpened(!opened)}>
      {opened ? "Close" : "Open console"}
    </button>
  </div>;
};
exports.default = DebugConsole;
