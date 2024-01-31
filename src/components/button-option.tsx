import type { PointerEventHandler } from "react";
import React, { useCallback } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";

const ButtonOption:WAMLComponent<'ButtonOption'> = ({ node, onPointerDown, ...props }) => {
  const { draggingObject, setDraggingObject, checkButtonOptionUsed } = useWAML();

  const used = checkButtonOptionUsed(node);

  const handlePointerDown = useCallback<PointerEventHandler<HTMLButtonElement>>(e => {
    onPointerDown?.(e);
    if(e.defaultPrevented) return;
    const $target = e.currentTarget;
    const startX = e.clientX;
    const startY = e.clientY;
    const { top, left } = $target.getBoundingClientRect();
    const onPointerMove = (f:PointerEvent) => {
      const deltaX = f.clientX - startX;
      const deltaY = f.clientY - startY;

      $target.style.top = `${top + deltaY}px`;
      $target.style.left = `${left + deltaX}px`;
    };
    const onPointerUp = () => {
      $target.style.top = "";
      $target.style.left = "";
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setDraggingObject(null);
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    setDraggingObject({ displayName: "ButtonOption", node, $target });
  }, [ node, onPointerDown, setDraggingObject ]);

  return <button
    disabled={used}
    onPointerDown={handlePointerDown}
    {...props}
    {...node.id === draggingObject?.node.id ? { 'data-dragging': true } : {}}
  >
    {node.value}
  </button>;
};
ButtonOption.displayName = "ButtonOption";
export default componentify(ButtonOption);