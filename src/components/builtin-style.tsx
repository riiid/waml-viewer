import type { FC } from "react";
import React, { memo } from "react";
import ScopedStyle from "./scoped-style";

type Props = {
  'children'?: string
};
const BuiltinStyle:FC<Props> = ({ children = "" }) => <ScopedStyle>{`
  @import "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css";
  .ChoiceOptionGroup {
    display: contents;
  }
  ${children}
`}</ScopedStyle>;
export default memo(BuiltinStyle);