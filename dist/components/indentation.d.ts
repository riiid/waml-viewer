import type { WAMLComponent } from "../types";
type Props = {
    depth: number;
};
declare const _default: WAMLComponent<keyof {
    SyntaxErrorHandler: import("@riiid/waml").WAML.ParserError;
    SemanticErrorHandler: import("../waml-error").default;
    Document: import("@riiid/waml").WAML.Document;
    LineComponent: import("@riiid/waml").WAML.LineComponent;
    Line: import("@riiid/waml").WAML.Line;
    Inline: import("@riiid/waml").WAML.Inline;
    PrefixedLine: import("@riiid/waml").WAML.Line[];
}, Props>;
export default _default;
