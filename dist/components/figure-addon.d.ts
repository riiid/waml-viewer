import type { WAMLComponent } from "../types";
declare const _default: WAMLComponent<keyof {
    Anchor: import("@riiid/waml").WAML.Anchor;
    Document: import("@riiid/waml").WAML.Document;
    FigureCaption: import("@riiid/waml").WAML.FigureAddon & {
        type: "caption";
    };
    FigureTitle: import("@riiid/waml").WAML.FigureAddon & {
        type: "title";
    };
    Inline: import("@riiid/waml").WAML.Inline;
    Line: import("@riiid/waml").WAML.Line;
    LineComponent: import("@riiid/waml").WAML.LineComponent;
    PrefixedLine: import("@riiid/waml").WAML.Line[];
    SemanticErrorHandler: import("../waml-error").default;
    SyntaxErrorHandler: import("@riiid/waml").WAML.ParserError;
}, {}>;
export default _default;
