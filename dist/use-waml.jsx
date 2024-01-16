"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAMLProvider = void 0;
const react_1 = require("react");
const context = (0, react_1.createContext)(null);
const useWAML = () => (0, react_1.useContext)(context);
exports.default = useWAML;
const WAMLProvider = ({ document, children }) => {
    const value = (0, react_1.useMemo)(() => ({
        metadata: document.metadata
    }), [document.metadata]);
    return <context.Provider value={value}>
    {children}
  </context.Provider>;
};
exports.WAMLProvider = WAMLProvider;
