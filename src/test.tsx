import type { ChangeEventHandler, FC } from "react";
import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import type { WAML } from "@riiid/waml";
import type { WAMLAction } from ".";
import WAMLViewer from ".";

const TestPage:FC = () => {
  const [ waml, setWAML ] = useState("Hello, World!");
  // eslint-disable-next-line @jjoriping/variable-name
  const [ explanationWrapper, setExplanationWrapper ] = useState<HTMLElement|null>(null);
  const [ x, setX ] = useState<WAML.Answer>();

  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    e => setWAML(e.currentTarget.value),
    []
  );
  const handleKnobAction = useCallback((e:WAMLAction) => {
    console.log("WAML Action", e);
    if(e.command === "play"){
      window.open(e.medium.uri);
    }
  }, []);

  return <>
    <textarea value={waml} onChange={handleChange} />
    {explanationWrapper && <WAMLViewer
      key={waml}
      waml={waml}
      options={{
        debug: true,
        explanationWrapper,
        prefixedLineClassMap: { "Test": "Good" },
        ChoiceOption: {
          getter: node => ({ 'data-value': node.value })
        }
      }}
      value={x}
      onChange={value => setX(value)}
      onInteract={e => console.log("WAML Interaction", e)}
      onKnobAction={handleKnobAction}
    />}
    <aside ref={setExplanationWrapper} />
  </>;
};
ReactDOM.render(<TestPage />, document.querySelector("#stage"));