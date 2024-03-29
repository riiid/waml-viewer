import type { PointerEventHandler, MouseEventHandler } from "react";
import React, { useCallback, useRef, useState } from "react";
import { hasKind } from "@riiid/waml";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import { getIntersection } from "../utility";

const ButtonBlank:WAMLComponent<'ButtonBlank'> = ({ node, onPointerEnter, onPointerLeave, onPointerUp, ...props }) => {
  const $self = useRef(false);
  const { getButtonOptionByValue, draggingObject, setDraggingObject, interactionToken, logInteraction } = useWAML(true);

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
    draggingObject.callback?.(interactionToken);
    setPreview(undefined);
  }, [ draggingObject, interactionToken, node.value, onPointerUp ]);

  const handlePointerDown = useCallback<PointerEventHandler<HTMLSpanElement>>(e => {
    // NOTE https://github.com/w3c/pointerevents/issues/178#issuecomment-1029108322
    (e.target as Element).releasePointerCapture(e.pointerId);

    const $target = e.currentTarget;
    // TODO ButtonOption을 value로 특정하는 방식은 value가 같은 ButtonOption의 처리를 곤란하게 만들고 있음. 번호를 이용하는 방식으로 바꿔야 함.
    // NOTE 번역 등 $target.textContent를 임의로 바꾸는 브라우저 기능에 의해 문제가 될 수 있음.
    const targetNode = getButtonOptionByValue($target.textContent!, interactionToken.seq);
    if(!targetNode) throw Error(`Unexpected ButtonBlank value: ${$target.textContent}`);
    $self.current = true;
    logInteraction({ type: "button-option-down", value: $target.textContent!, index: interactionToken.seq });
    setDraggingObject({
      displayName: "ButtonBlank",
      node: targetNode,
      e: e.nativeEvent,
      currentTarget: $target,
      callback: token => {
        const { seq, input, interactionValue } = token;
        if(seq === interactionToken.seq) return;
        if(multiple || input?.type === "MULTIPLE" || !interactionValue){
          if(multiple) interactionToken.handleInteract(targetNode.value);
          else interactionToken.unsetInteract();
          logInteraction({ type: "button-blank-set", value: null, index: interactionToken.seq });
        }else{
          interactionToken.handleInteract(interactionValue);
          logInteraction({ type: "button-blank-set", value: interactionValue, index: interactionToken.seq });
        }
        token.handleInteract(targetNode.value, true);
        logInteraction({ type: "button-blank-set", value: targetNode.value, index: seq });
      }
    });
    e.preventDefault();
  }, [ getButtonOptionByValue, interactionToken, logInteraction, multiple, setDraggingObject ]);
  const handleClick = useCallback<MouseEventHandler<HTMLSpanElement>>(e => {
    if(multiple){
      interactionToken.handleInteract(e.currentTarget.textContent!);
    }else{
      interactionToken.unsetInteract();
    }
    logInteraction({ type: "button-blank-set", value: null, index: interactionToken.seq });
  }, [ interactionToken, logInteraction, multiple ]);

  const $words = interactionToken.input?.value.map((v, i) => {
    const dragging = draggingObject?.node.kind === "ButtonOption" && draggingObject.node.value === v;

    return (
      <span
        key={i}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        translate="no"
        data-value={v}
        {...dragging ? { 'data-dragging': true } : {}}
      >{v}</span>
    );
  });

  return <span
    onPointerEnter={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
    onPointerUp={handlePointerUp}
    translate="no"
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