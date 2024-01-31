import type { PointerEventHandler, MouseEventHandler } from "react";
import { useCallback, useState } from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";
import useWAML from "../use-waml";
import { getIntersection } from "../utility";

const ButtonBlank:WAMLComponent<'ButtonBlank'> = ({ node, onPointerEnter, onPointerLeave, onPointerUp, ...props }) => {
  const { draggingObject, interactionToken } = useWAML(true);

  const [ preview, setPreview ] = useState<string>();
  const multiple = interactionToken.input?.type === "MULTIPLE";

  const handlePointerEnter = useCallback<PointerEventHandler<HTMLSpanElement>>(e => {
    onPointerEnter?.(e);
    if(e.defaultPrevented) return;
    if(!draggingObject) return;
    if(!getIntersection(draggingObject.node.group, node.value).length) return;
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
    if(!getIntersection(draggingObject.node.group, node.value).length) return;
    interactionToken.handleInteract(draggingObject.node.value);
    setPreview(undefined);
  }, [ draggingObject, interactionToken, node.value, onPointerUp ]);
  const handleClick = useCallback<MouseEventHandler<HTMLSpanElement>>(e => {
    if(multiple){
      interactionToken.handleInteract(e.currentTarget.textContent!);
    }else{
      interactionToken.unsetInteract();
    }
  }, [ interactionToken, multiple ]);

  return <span
    onPointerEnter={handlePointerEnter}
    onPointerLeave={handlePointerLeave}
    onPointerUp={handlePointerUp}
    {...props}
    {...preview ? { 'data-preview': true } : {}}
  >
    {(multiple || !preview) && interactionToken.input?.value.map((v, i) => (
      <span key={i} onClick={handleClick}>{v}</span>
    ))}
    {Boolean(preview) && <span>{preview}</span>}
  </span>;
};
ButtonBlank.displayName = "ButtonBlank";
export default componentify(ButtonBlank);