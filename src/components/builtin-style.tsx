import type { FC } from "react";
import { memo } from "react";
import ScopedStyle from "./scoped-style";

const BuiltinStyle:FC = () => <ScopedStyle>{`
  @import "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css";
`}</ScopedStyle>;
export default memo(BuiltinStyle);