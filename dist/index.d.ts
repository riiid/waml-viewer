import type { FC, HTMLAttributes } from "react";
export interface WAMLViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    waml: string;
}
declare const WAMLViewer: FC<WAMLViewerProps>;
export default WAMLViewer;
