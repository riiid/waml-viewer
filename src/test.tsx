import type { ChangeEventHandler, FC } from "react";
import { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import WAMLViewer from ".";

const TestPage:FC = () => {
  const [ waml, setWAML ] = useState("Hello, World!");

  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    e => setWAML(e.currentTarget.value),
    []
  );

  return <>
    <textarea value={waml} onChange={handleChange} />
    <WAMLViewer waml={waml} />
  </>;
};
ReactDOM.render(<TestPage />, document.querySelector("#stage"));