import type { FC } from "react";
import { useState } from "react";
import type { WAMLDocument } from "@riiid/waml";

type Props = {
  document: WAMLDocument
};
const DebugConsole:FC<Props> = ({ document }) => {
  const [ opened, setOpened ] = useState(false);

  return <div className="DebugConsole">
    {opened && <div>
      <pre>{JSON.stringify(document.raw, null, 2)}</pre>
    </div>}
    <button onClick={() => setOpened(!opened)}>
      {opened ? "닫기" : "WAML 콘솔 열기"}
    </button>
  </div>;
};
export default DebugConsole;