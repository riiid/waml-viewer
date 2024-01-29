import { WAMLDocument } from "@riiid/waml";
import type { FC, HTMLAttributes } from "react";
import type { ASTMiddleware, WAMLViewerOptions } from "./types";
export interface WAMLViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    waml: string | WAMLDocument;
    middlewares?: ASTMiddleware[];
    options?: WAMLViewerOptions;
    bare?: boolean;
}
declare const WAMLViewer: FC<WAMLViewerProps>;
export default WAMLViewer;
