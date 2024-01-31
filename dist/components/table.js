"use strict";
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
const react_3 = __importDefault(require("react"));
const columnsPattern = /^\d+(:\d+)*$/;
const Table = ({ node, style, className, ...props }) => {
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
                        css.width = "100%";
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
    const sumOfColumns = (0, react_1.useMemo)(() => attributes.columns?.reduce((pv, v) => pv + v, 0), [attributes.columns]);
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
                    $cells.push(react_3.default.createElement("th", { key: $cells.length, ...cellProps },
                        react_3.default.createElement(document_1.default, { node: v.body })));
                }
                else {
                    $cells.push(react_3.default.createElement("td", { key: $cells.length, ...cellProps },
                        react_3.default.createElement(document_1.default, { node: v.body })));
                }
            }
            else {
                R.push(react_3.default.createElement("tr", { key: R.length }, $cells));
                $cells = [];
            }
        }
        if ($cells.length)
            R.push(react_3.default.createElement("tr", { key: R.length }, $cells));
        return R;
    }, [node.content]);
    return (react_3.default.createElement("table", { className: attributes.className, style: { ...attributes.css, ...style }, ...props },
        attributes.columns && (react_3.default.createElement("colgroup", null, attributes.columns.map((v, i) => (react_3.default.createElement("col", { key: i, width: `${(v / sumOfColumns) * 100}%` }))))),
        react_3.default.createElement("tbody", null, $rows)));
};
Table.displayName = "Table";
exports.default = (0, componentify_1.default)(Table);
