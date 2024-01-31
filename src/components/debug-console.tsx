import type { FC } from "react";
import { useState } from "react";
import type { WAMLDocument } from "@riiid/waml";
import useWAML from "../use-waml";

type Props = {
  document: WAMLDocument
};
const DebugConsole:FC<Props> = ({ document }) => {
  const { value } = useWAML();
  const [ opened, setOpened ] = useState(false);

  return <div className="DebugConsole">
    {opened && <div>
      <h1>답안</h1>
      <pre>{JSON.stringify(value, null, 2)}</pre>
      <h1>메타데이터</h1>
      <pre>{JSON.stringify(document.metadata, null, 2)}</pre>
      <h1>AST</h1>
      <pre>{JSON.stringify(document.raw, null, 2)}</pre>
    </div>}
    <button onClick={() => setOpened(!opened)}>
      {opened ? "Close" : "Open console"}
    </button>
  </div>;
};
export default DebugConsole;