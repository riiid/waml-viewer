import type { MouseEventHandler } from "react";
import React, { useCallback } from "react";
import { WAML, hasKind } from "@riiid/waml";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import Inline from "./inline";

const PairingOption:WAMLComponent<'PairingOption'> = ({ node, onClick, ...props }) => {
  const { draggingObject, setDraggingObject, pairing, setFlattenValue, logInteraction } = useWAML();
  const { refInbound, refOutbound } = pairing.getDotRefs(node);

  const dragging = draggingObject?.node === node;
  const inboundPaired = pairing.pairedVertices[node.cell.value]?.some(v => 'from' in v) || false;
  const outboundPaired = pairing.pairedVertices[node.cell.value]?.some(v => 'to' in v) || false;

  const handleClick = useCallback<MouseEventHandler<HTMLLIElement>>(e => {
    onClick?.(e);
    if(e.defaultPrevented) return;
    if(draggingObject){
      setDraggingObject(null);
      if(!hasKind(draggingObject.node, 'PairingOption')) return;
      logInteraction({ type: "pairing-option-click", prev: draggingObject.node.cell.value, value: node.cell.value });
      const draggingNode = draggingObject.node;

      setFlattenValue((prev, interactions) => {
        const [ netIndex, actualValue ] = pairing.getNetIndexByEdge(draggingNode.cell.value, node.cell.value);
        const net = netIndex === -1 ? undefined : interactions[netIndex];
        if(net?.type !== WAML.InteractionType.PAIRING_NET) return false;
        const [ from, to ] = actualValue.split('→');
        const fromNet = (draggingNode.cell.value === from
          ? draggingNode.cell
          : node.cell
        ).outbound.find(v => v.name === net.name);
        const toNet = (draggingNode.cell.value === to
          ? draggingNode.cell
          : node.cell
        ).inbound.find(v => v.name === net.name);
        const next = [ ...prev ];

        if(prev[netIndex]){
          next[netIndex] = {
            type: "MULTIPLE",
            ordered: false,
            value: prev[netIndex].value.filter(v => {
              if(v.startsWith(`${from}→`) && !fromNet?.multiple) return false;
              if(v.endsWith(`→${to}`) && !toNet?.multiple) return false;
              if(v === actualValue) return false;
              return true;
            })
          };
          next[netIndex].value.push(actualValue);
        }else{
          next[netIndex] = { type: "MULTIPLE", ordered: false, value: [ actualValue ] };
        }
        return next;
      });
    }else{
      logInteraction({ type: "pairing-option-click", value: node.cell.value });
      setDraggingObject({
        displayName: "PairingOption",
        node,
        e: e.nativeEvent,
        currentTarget: e.currentTarget
      });
    }
  }, [ draggingObject, logInteraction, node, onClick, pairing, setDraggingObject, setFlattenValue ]);

  return <li
    onClick={handleClick}
    {...props}
    {...dragging ? { 'data-dragging': true } : {}}
    {...inboundPaired ? { 'data-inbound-paired': true } : {}}
    {...outboundPaired ? { 'data-outbound-paired': true } : {}}
  >
    {node.cell.inbound.length > 0 && <input ref={refInbound} type="radio" checked={inboundPaired} readOnly />}
    <div>
      {node.inlines.map((v, i) => <Inline key={i} node={v} />)}
    </div>
    {node.cell.outbound.length > 0 && <input ref={refOutbound} type="radio" checked={outboundPaired} readOnly />}
  </li>;
};
PairingOption.displayName = "PairingOption";
export default componentify(PairingOption);