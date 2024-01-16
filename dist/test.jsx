"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = __importDefault(require("react-dom"));
const _1 = __importDefault(require("."));
const TestPage = () => {
    const [waml, setWAML] = (0, react_1.useState)("Hello, World!");
    const handleChange = (0, react_1.useCallback)(e => setWAML(e.currentTarget.value), []);
    return <>
    <textarea value={waml} onChange={handleChange}/>
    <_1.default waml={waml}/>
  </>;
};
react_dom_1.default.render(<TestPage />, document.querySelector("#stage"));
