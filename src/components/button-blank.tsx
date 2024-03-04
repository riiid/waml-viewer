import type { PointerEventHandler, MouseEventHandler } from "react";
import React, { useCallback, useRef, useState } from "react";
import { hasKind } from "@riiid/waml";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import { getIntersection } from "../utility";

const ButtonBlank:WAMLComponent<'ButtonBlank'> = ({ node, onPointerEnter, onPointerLeave, onPointerUp, ...props }) => {
  const $self = useRef(false);
  const { getButtonOptionByValue, draggingObject, setDraggingObject, interactionToken } = useWAML(true);

  const [ preview, setPreview ] = useState<string>();
  const multiple = interactionToken.input?.type === "MULTIPLE";

  const handlePointerEnter = useCallback<PointerEventHandler<HTMLSpanElement>>(e => {
    onPointerEnter?.(e);
    if(e.defaultPrevented) return;
    if(!draggingObject) return;
    if(!hasKind(draggingObject.node, 'ButtonOption')) return;
    if(!getIntersection(draggingObject.node.group, node.value).length) return;
    $self.current = false;
    setPreview(draggingObject.node.value);
  }, [ draggingObject, node.value, onPointerEnter ]);
  const handlePointerLeave = useCallback<PointerEventHandler<HTMLSpanElement>>(e => {
    onPointerLeave?.(e);
    if(e.defaultPrevented) return;
    if(!draggingObject) return;
    setPreview(undefined);
  }, [ draggingObject, onPointerLeave ]);
  const handlePointerUp = useCallback<PointerEventHandler<HTMLSpanElement>>(e => {
    onPointerUp?.(e);
    if(e.defaultPrevented) return;
    if(!draggingObject) return;
    if(!hasKind(draggingObject.node, 'ButtonOption')) return;
    if(!getIntersection(draggingObject.node.group, node.value).length) return;
    if($self.current) return;
    draggingObject.callback?.(interactionToken.interactionValue);
    interactionToken.handleInteract(draggingObject.node.value, true);
    setPreview(undefined);
  }, [ draggingObject, interactionToken, node, onPointerUp ]);

  const handlePointerDown = useCallback<PointerEventHandler<HTMLSpanElement>>(e => {
    // NOTE https://github.com/w3c/pointerevents/issues/178#issuecomment-1029108322
    (e.target as Element).releasePointerCapture(e.pointerId);
    const $target = e.currentTarget;
    const targetNode = getButtonOptionByValue($target.textContent!);
    if(!targetNode) throw Error(`Unexpected ButtonBlank value: ${$target.textContent}`);
    $self.current = true;
    setDraggingObject({
      displayName: "ButtonBlank",
      node: targetNode,
      e: e.nativeEvent,
      currentTarget: $target,
      callback: value => {
        if(targetNode.value === value) return;
        if(multiple){
          interactionToken.handleInteract($target.textContent!);
        }else if(value){
          interactionToken.handleInteract(value);
        }else{
          interactionToken.unsetInteract();
        }
      }
    });
    e.preventDefault();
  }, [ getButtonOptionByValue, interactionToken, multiple, setDraggingObject ]);
  const handleClick = useCallback<MouseEventHandler<HTMLSpanElement>>(e => {
    if(multiple){
      interactionToken.handleInteract(e.currentTarget.textContent!);
    }else{
      interactionToken.unsetInteract();
    }
  }, [ interactionToken, multiple ]);

  const $words = interactionToken.input?.value.map((v, i) => {
    const dragging = draggingObject?.node.kind === "ButtonOption" && draggingObject.node.value === v;

    return (
      <span
        key={i}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        data-value={v}
        {...dragging ? { 'data-dragging': true } : {}}
      >{v}</span>
    );
  });

  return <span
    onPointerEnter={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
    onPointerUp={handlePointerUp}
    {...props}
    {...preview ? { 'data-preview': true } : {}}
    {...draggingObject?.node.kind === "ButtonOption" && interactionToken.input?.value.includes(draggingObject.node.value) ? { 'data-child-dragging': true } : {}}
  >
    {$words}
    {multiple && Boolean(preview) && <span>{preview}</span>}
  </span>;
};
ButtonBlank.displayName = "ButtonBlank";
export default componentify(ButtonBlank);