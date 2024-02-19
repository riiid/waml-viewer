import type { PointerEventHandler } from "react";
import React, { useCallback, useEffect, useRef } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";

const ButtonOption:WAMLComponent<'ButtonOption'> = ({ node, onPointerDown, ...props }) => {
  const $ = useRef<HTMLButtonElement>(null);
  const { draggingObject, setDraggingObject, checkButtonOptionUsed, renderingVariables } = useWAML();

  const used = checkButtonOptionUsed(node);
  const dragging = draggingObject?.node === node;

  const handlePointerDown = useCallback<PointerEventHandler<HTMLButtonElement>>(e => {
    onPointerDown?.(e);
    if(e.defaultPrevented) return;
    setDraggingObject({ displayName: "ButtonOption", node, e: e.nativeEvent });
  }, [ node, onPointerDown, setDraggingObject ]);

  renderingVariables.buttonOptions[node.id] = node;
  useEffect(() => {
    if(draggingObject?.node !== node) return;
    if(!$.current) return;
    const $target = $.current;
    const { e } = draggingObject;
    const onPointerMove = (f:PointerEvent) => {
      f.preventDefault();
      $target.style.top = `${f.clientY}px`;
      $target.style.left = `${f.clientX}px`;
    };
    const onPointerUp = () => {
      $target.style.top = "";
      $target.style.left = "";
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setDraggingObject(null);
    };
    $target.style.top = `${e.clientY}px`;
    $target.style.left = `${e.clientX}px`;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [ draggingObject, node, setDraggingObject ]);

  return <button
    ref={$}
    disabled={used}
    onPointerDown={handlePointerDown}
    {...props}
    {...dragging ? { 'data-dragging': true } : {}}
  >
    {node.value}
  </button>;
};
ButtonOption.displayName = "ButtonOption";
export default componentify(ButtonOption);