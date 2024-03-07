import type { WAML } from "@riiid/waml";
import { WAMLDocument } from "@riiid/waml";
import type { FC, HTMLAttributes } from "react";
import type { ASTMiddleware, WAMLUserInteraction, WAMLViewerOptions } from "./types";
export interface WAMLViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'onChange'> {
    waml: string | WAMLDocument;
    middlewares?: ASTMiddleware[];
    options?: WAMLViewerOptions;
    bare?: boolean;
    defaultValue?: WAML.Answer;
    value?: WAML.Answer;
    onChange?(value: WAML.Answer): void;
    onInteract?(e: WAMLUserInteraction): void;
}
declare const WAMLViewer: FC<WAMLViewerProps>;
export default WAMLViewer;
export * from "./types";
