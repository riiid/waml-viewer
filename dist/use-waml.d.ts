import type { WAML, WAMLDocument } from "@riiid/waml";
import type { FCWithChildren, WAMLComponentType, WAMLViewerOptions } from "./types";
type SplittedFormOf<T extends string> = T extends `${infer A}${infer B}` ? B extends "" ? [A] : [A, ...SplittedFormOf<B>] : [];
type FirstLetterOf<T extends string> = SplittedFormOf<T>[0];
type Context = {
    'metadata': WAML.Metadata;
    'commonOptions': {
        [key in keyof WAMLViewerOptions as FirstLetterOf<key> extends Lowercase<FirstLetterOf<key>> ? key : never]: WAMLViewerOptions[key];
    };
    'getComponentOptions': <T extends WAMLComponentType>(type: T) => WAMLViewerOptions[T];
    'getURL': (uri: string) => string;
    'renderingVariables': {
        'pendingClasses': string[];
    };
};
type Props = {
    'document': WAMLDocument | WAML.ParserError;
    'options': WAMLViewerOptions;
};
declare const useWAML: () => Context;
export default useWAML;
export declare const WAMLProvider: FCWithChildren<Props>;
