"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const waml_1 = require("@riiid/waml");
const WAMLViewer = ({ waml }) => {
    const [currentError, setCurrentError] = (0, react_1.useState)();
    const document = (0, react_1.useMemo)(() => {
        try {
            const R = new waml_1.WAMLDocument(waml);
            setCurrentError(undefined);
            return R;
        }
        catch (error) {
            if (error instanceof Error)
                console.warn(error.stack);
            setCurrentError(String(error));
            return undefined;
        }
    }, [waml]);
    if (currentError) {
        return <article>{currentError}</article>;
    }
    return <article>
    <h2>Hello, World!</h2>
    <pre>
      {JSON.stringify(document, null, 2)}
    </pre>
  </article>;
};
exports.default = WAMLViewer;
