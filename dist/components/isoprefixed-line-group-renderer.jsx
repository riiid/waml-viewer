"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const waml_1 = require("@riiid/waml");
const react_1 = require("react");
const line_1 = __importDefault(require("./line"));
const prefixed_line_1 = __importDefault(require("./prefixed-line"));
const IsoprefixedLineGroupRenderer = ({ depth = 0, lines }) => {
    const lineGroups = (0, react_1.useMemo)(() => getIsoprefixedLineGroups(lines, depth), [depth, lines]);
    return (<>
      {lineGroups.map(({ prefix, lines: sublines }, i) => {
            switch (prefix) {
                case "":
                    return (<react_1.Fragment key={i}>
                {sublines.map((w, j) => <line_1.default key={j} node={w} next={sublines[j + 1]}/>)}
              </react_1.Fragment>);
                case waml_1.WAML.LinePrefix.QUESTION:
                    return <prefixed_line_1.default key={i} type="Question" depth={depth + 1} node={sublines}/>;
                case waml_1.WAML.LinePrefix.QUOTATION:
                    return <prefixed_line_1.default key={i} type="Quotation" depth={depth + 1} node={sublines}/>;
                case waml_1.WAML.LinePrefix.INDENTATION:
                    return <prefixed_line_1.default key={i} type="Indentation" depth={depth + 1} node={sublines}/>;
                default:
                    throw Error(`Unhandled prefix: ${prefix}`);
            }
        })}
    </>);
};
exports.default = IsoprefixedLineGroupRenderer;
function getIsoprefixedLineGroups(lines, depth = 0) {
    var _a;
    const R = [];
    let currentLines = [];
    let pivotPrefix;
    for (let i = 0; i < lines.length; i++) {
        const prefix = ((_a = lines[i].prefixes[depth]) === null || _a === void 0 ? void 0 : _a.value) || "";
        if (pivotPrefix === undefined) {
            currentLines.push(lines[i]);
            pivotPrefix = prefix;
        }
        else if (pivotPrefix === prefix) {
            currentLines.push(lines[i]);
        }
        else {
            R.push({ prefix: pivotPrefix, lines: [...currentLines] });
            currentLines = [lines[i]];
            pivotPrefix = prefix;
        }
    }
    if (pivotPrefix !== undefined && currentLines.length) {
        R.push({ prefix: pivotPrefix, lines: [...currentLines] });
    }
    return R;
}
