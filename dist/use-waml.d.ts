import type { WAMLDocument } from "@riiid/waml";
import { WAML } from "@riiid/waml";
import type { FCWithChildren, WAMLComponentType, WAMLViewerOptions } from "./types.js";
import InteractionToken from "./interaction-token.js";
type SplittedFormOf<T extends string> = T extends `${infer A}${infer B}` ? B extends "" ? [A] : [A, ...SplittedFormOf<B>] : [];
type FirstLetterOf<T extends string> = SplittedFormOf<T>[0];
type DraggingObject = {
    'displayName': WAMLComponentType;
    'node': WAML.ButtonOption;
    '$target': HTMLElement;
};
type Context = {
    'commonOptions': {
        [key in keyof WAMLViewerOptions as FirstLetterOf<key> extends Lowercase<FirstLetterOf<key>> ? key : never]: WAMLViewerOptions[key];
    };
    'draggingObject': DraggingObject | null;
    'interactionToken': InteractionToken;
    'metadata': WAML.Metadata;
    'renderingVariables': {
        'pendingClasses': string[];
        'interactionTokenIndex': Record<string, number>;
        'buttonOptionUsed': Record<string, number[]>;
    };
    'value': WAML.Answer | undefined;
    'checkButtonOptionUsed': (node: WAML.ButtonOption) => boolean;
    'getComponentOptions': <T extends WAMLComponentType>(type: T) => WAMLViewerOptions[T];
    'getURL': (uri: string) => string;
    'invokeInteractionToken': (id: string) => InteractionToken;
    'setDraggingObject': (value: DraggingObject | null) => void;
};
type Props = {
    'document': WAMLDocument | WAML.ParserError;
    'options': WAMLViewerOptions;
};
declare const useWAML: (invokingInteractionToken?: boolean) => Context;
export default useWAML;
export declare const WAMLProvider: FCWithChildren<Props>;
