import type { ChangeEventHandler, FC } from "react";
import { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import WAMLViewer from ".";

const TestPage:FC = () => {
  const [ waml, setWAML ] = useState("Hello, World!");
  // eslint-disable-next-line @jjoriping/variable-name
  const [ explanationWrapper, setExplanationWrapper ] = useState<HTMLElement|null>(null);

  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    e => setWAML(e.currentTarget.value),
    []
  );

  return <>
    <textarea value={waml} onChange={handleChange} />
    {explanationWrapper && <WAMLViewer key={waml} waml={waml} options={{ debug: true, explanationWrapper }} />}
    <aside ref={setExplanationWrapper} />
  </>;
};
ReactDOM.render(<TestPage />, document.querySelector("#stage"));