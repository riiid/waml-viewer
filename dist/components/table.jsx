"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const waml_1 = require("@riiid/waml");
const componentify_1 = __importDefault(require("../componentify"));
const waml_error_1 = __importDefault(require("../waml-error"));
const react_2 = require("../react");
const document_1 = __importDefault(require("./document"));
const columnsPattern = /^\d+(:\d+)*$/;
const Table = (_a) => {
    var { node, style, className } = _a, props = __rest(_a, ["node", "style", "className"]);
    const attributes = (0, react_1.useMemo)(() => {
        const css = {};
        let actualClassName = className;
        let columns;
        for (const { key, value } of node.attributes) {
            switch (key) {
                case "class":
                    actualClassName = (0, react_2.C)(className, value);
                    break;
                case "columns":
                    if (value === "fixed") {
                        css.tableLayout = "fixed";
                    }
                    else if (columnsPattern.test(value)) {
                        columns = value.split(':').map(w => parseInt(w));
                    }
                    else {
                        throw new waml_error_1.default(`Malformed columns value: ${value}`, node);
                    }
                    break;
                default:
                    throw new waml_error_1.default(`Unknown table attribute: ${key}`, node);
            }
        }
        return { css, className: actualClassName, columns };
    }, [className, node]);
    const sumOfColumns = (0, react_1.useMemo)(() => { var _a; return (_a = attributes.columns) === null || _a === void 0 ? void 0 : _a.reduce((pv, v) => pv + v, 0); }, [attributes.columns]);
    const $rows = (0, react_1.useMemo)(() => {
        const R = [];
        let $cells = [];
        for (const v of node.content) {
            if ((0, waml_1.hasKind)(v, 'Cell')) {
                const cellProps = {
                    rowSpan: v.rowspan,
                    colSpan: v.colspan
                };
                if (v.alignment)
                    cellProps.style = { textAlign: v.alignment };
                if (v.prefix === "#") {
                    $cells.push(<th key={$cells.length} {...cellProps}>
              <document_1.default node={v.body}/>
            </th>);
                }
                else {
                    $cells.push(<td key={$cells.length} {...cellProps}>
              <document_1.default node={v.body}/>
            </td>);
                }
            }
            else {
                R.push(<tr key={R.length}>{$cells}</tr>);
                $cells = [];
            }
        }
        if ($cells.length)
            R.push(<tr key={R.length}>{$cells}</tr>);
        return R;
    }, [node.content]);
    return (<table className={attributes.className} style={Object.assign(Object.assign({}, attributes.css), style)} {...props}>
      {attributes.columns && (<colgroup>
          {attributes.columns.map((v, i) => (<col key={i} width={`${(v / sumOfColumns) * 100}%`}/>))}
        </colgroup>)}
      <tbody>{$rows}</tbody>
    </table>);
};
Table.displayName = "Table";
exports.default = (0, componentify_1.default)(Table);
