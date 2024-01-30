import type { WAMLDocument } from "@riiid/waml";
import { WAML } from "@riiid/waml";
import type { FCWithChildren, WAMLComponentType, WAMLViewerOptions } from "./types";
import InteractionToken from "./interaction-token";
type SplittedFormOf<T extends string> = T extends `${infer A}${infer B}` ? B extends "" ? [A] : [A, ...SplittedFormOf<B>] : [];
type FirstLetterOf<T extends string> = SplittedFormOf<T>[0];
type Context = {
    'metadata': WAML.Metadata;
    'commonOptions': {
        [key in keyof WAMLViewerOptions as FirstLetterOf<key> extends Lowercase<FirstLetterOf<key>> ? key : never]: WAMLViewerOptions[key];
    };
    'getComponentOptions': <T extends WAMLComponentType>(type: T) => WAMLViewerOptions[T];
    'getURL': (uri: string) => string;
    'value': WAML.Answer | undefined;
    'invokeInteractionToken': (id: string) => InteractionToken;
    'interactionToken': InteractionToken;
    'renderingVariables': {
        'pendingClasses': string[];
        'interactionTokenIndex': Record<string, number>;
    };
};
type Props = {
    'document': WAMLDocument | WAML.ParserError;
    'options': WAMLViewerOptions;
};
declare const useWAML: (invokingInteractionToken?: boolean) => Context;
export default useWAML;
export declare const WAMLProvider: FCWithChildren<Props>;
