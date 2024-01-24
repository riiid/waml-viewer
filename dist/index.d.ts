import type { FC, HTMLAttributes } from "react";
import type { WAMLViewerOptions } from "./types";
export interface WAMLViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    waml: string;
    options?: WAMLViewerOptions;
}
declare const WAMLViewer: FC<WAMLViewerProps>;
export default WAMLViewer;
