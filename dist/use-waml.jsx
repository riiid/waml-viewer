"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAMLProvider = void 0;
const react_1 = require("react");
const context = (0, react_1.createContext)(null);
const useWAML = () => (0, react_1.useContext)(context);
exports.default = useWAML;
const WAMLProvider = ({ document, options, children }) => {
    const $renderingVariables = (0, react_1.useRef)({
        pendingClasses: []
    });
    const value = (0, react_1.useMemo)(() => ({
        metadata: 'error' in document ? null : document.metadata,
        commonOptions: {
            noDefaultClassName: options.noDefaultClassName || false
        },
        getComponentOptions: type => options[type],
        renderingVariables: $renderingVariables.current
    }), [document, options]);
    return <context.Provider value={value}>
    {children}
  </context.Provider>;
};
exports.WAMLProvider = WAMLProvider;
