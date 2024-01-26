import type { CSSProperties, ReactNode } from "react";
import { useMemo } from "react";
import { hasKind } from "@riiid/waml";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import WAMLError from "../waml-error";
import Document from "./document";

const columnsPattern = /^\d+(:\d+)*$/;

const Table:WAMLComponent<'Table'> = ({ node, style, ...props }) => {
  const attributes = useMemo(() => {
    const css:CSSProperties = {};
    let columns:number[]|undefined;

    for(const { key, value } of node.attributes){
      switch(key){
        case "columns":
          if(value === "fixed"){
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
    return { css, columns };
  }, [ node ]);
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
    <table style={{ ...attributes.css, ...style }} {...props}>
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