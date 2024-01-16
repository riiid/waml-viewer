import type { WAML, WAMLDocument } from "@riiid/waml";
import type { FCWithChildren } from "./types";
type Context = {
    'metadata': WAML.Metadata;
};
type Props = {
    'document': WAMLDocument;
};
declare const useWAML: () => Context;
export default useWAML;
export declare const WAMLProvider: FCWithChildren<Props>;
