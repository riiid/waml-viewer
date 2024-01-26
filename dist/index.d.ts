import type { FC, HTMLAttributes } from "react";
import type { ASTMiddleware, WAMLViewerOptions } from "./types";
export interface WAMLViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    waml: string;
    middlewares?: ASTMiddleware[];
    options?: WAMLViewerOptions;
}
declare const WAMLViewer: FC<WAMLViewerProps>;
export default WAMLViewer;
