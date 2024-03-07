import type { PointerEventHandler } from "react";
import React, { useCallback, useEffect, useRef } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";

const ButtonOption:WAMLComponent<'ButtonOption'> = ({ node, style, onPointerDown, ...props }) => {
  const $ = useRef<HTMLButtonElement>(null);
  const $ghost = useRef<HTMLButtonElement>(null);
  const { draggingObject, setDraggingObject, checkButtonOptionUsed, renderingVariables, logInteraction } = useWAML();

  const used = checkButtonOptionUsed(node);
  const dragging = draggingObject?.node === node;

  const handlePointerDown = useCallback<PointerEventHandler<HTMLButtonElement>>(e => {
    onPointerDown?.(e);
    if(e.defaultPrevented) return;
    // NOTE https://github.com/w3c/pointerevents/issues/178#issuecomment-1029108322
    (e.target as Element).releasePointerCapture(e.pointerId);
    logInteraction({ type: "button-option-down", value: node.value });
    setDraggingObject({
      displayName: "ButtonOption",
      node,
      e: e.nativeEvent,
      currentTarget: e.currentTarget,
      callback: token => {
        token.handleInteract(node.value, true);
        logInteraction({ type: "button-blank-set", value: node.value, index: token.seq });
      }
    });
    e.preventDefault();
  }, [ logInteraction, node, onPointerDown, setDraggingObject ]);

  renderingVariables.buttonOptions[node.id] = node;
  useEffect(() => {
    if(draggingObject?.node !== node) return;
    if(!$ghost.current) return;
    const $target = $ghost.current;
    const { e, currentTarget } = draggingObject;
    const rect = currentTarget.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    const onPointerMove = (f:PointerEvent) => {
      f.preventDefault();
      $target.style.top = `${f.clientY}px`;
      $target.style.left = `${f.clientX}px`;
    };
    const onPointerUp = () => {
      logInteraction({ type: "button-option-up", value: node.value });
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setDraggingObject(null);
    };
    $target.style.visibility = "visible";
    $target.style.transform = `translate(-${startX}px, -${startY}px)`;
    $target.style.top = `${e.clientY}px`;
    $target.style.left = `${e.clientX}px`;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [ draggingObject, logInteraction, node, setDraggingObject ]);

  const R = <button
    ref={$}
    disabled={used}
    onPointerDown={handlePointerDown}
    {...props}
    {...dragging ? { 'data-dragging': true } : {}}
    style={{ ...style, 'touchAction': "none" }}
  >
    {node.value}
  </button>;

  return dragging
    ? <>
      {R}
      <button ref={$ghost} {...props} data-ghost>{node.value}</button>
    </>
    : R
  ;
};
ButtonOption.displayName = "ButtonOption";
export default componentify(ButtonOption);