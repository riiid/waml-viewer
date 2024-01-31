import type { CSSProperties, ReactNode } from "react";
import { useMemo } from "react";
import { hasKind } from "@riiid/waml";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import WAMLError from "../waml-error";
import { C } from "../react";
import Document from "./document";
import React from "react";

const columnsPattern = /^\d+(:\d+)*$/;

const Table:WAMLComponent<'Table'> = ({ node, style, className, ...props }) => {
  const attributes = useMemo(() => {
    const css:CSSProperties = {};
    let actualClassName = className;
    let columns:number[]|undefined;

    for(const { key, value } of node.attributes){
      switch(key){
        case "class":
          actualClassName = C(className, value);
          break;
        case "columns":
          if(value === "fixed"){
            css.width = "100%";
            css.tableLayout = "fixed";
          }else if(columnsPattern.test(value)){
            columns = value.split(':').map(w => parseInt(w));
          }else{
            throw new WAMLError(`Malformed columns value: ${value}`, node);
          }
          break;
        default:
          throw new WAMLError(`Unknown table attribute: ${key}`, node);
      }
    }
    return { css, className: actualClassName, columns };
  }, [ className, node ]);
  const sumOfColumns = useMemo(
    () => attributes.columns?.reduce((pv, v) => pv + v, 0),
    [ attributes.columns ]
  );
  const $rows = useMemo(() => {
    const R:ReactNode[] = [];
    let $cells:ReactNode[] = [];

    for(const v of node.content){
      if(hasKind(v, 'Cell')){
        const cellProps:JSX.IntrinsicElements['td'] = {
          rowSpan: v.rowspan,
          colSpan: v.colspan
        };
        if(v.alignment) cellProps.style = { textAlign: v.alignment };
        if(v.prefix === "#"){
          $cells.push(
            <th key={$cells.length} {...cellProps}>
              <Document node={v.body} />
            </th>
          );
        }else{
          $cells.push(
            <td key={$cells.length} {...cellProps}>
              <Document node={v.body} />
            </td>
          );
        }
      }else{
        R.push(<tr key={R.length}>{$cells}</tr>);
        $cells = [];
      }
    }
    if($cells.length) R.push(<tr key={R.length}>{$cells}</tr>);
    return R;
  }, [ node.content ]);

  return (
    <table className={attributes.className} style={{ ...attributes.css, ...style }} {...props}>
      {attributes.columns && (
        <colgroup>
          {attributes.columns.map((v, i) => (
            <col key={i} width={`${(v / sumOfColumns!) * 100}%`} />
          ))}
        </colgroup>
      )}
      <tbody>{$rows}</tbody>
    </table>
  );
};
Table.displayName = "Table";
export default componentify(Table);