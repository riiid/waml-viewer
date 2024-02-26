import type { WAMLDocument } from "@riiid/waml";
import { WAML } from "@riiid/waml";
import type { FCWithChildren, WAMLComponentType, WAMLViewerOptions } from "./types.js";
import InteractionToken, { flattenAnswer } from "./interaction-token.js";
type SplittedFormOf<T extends string> = T extends `${infer A}${infer B}` ? B extends "" ? [A] : [A, ...SplittedFormOf<B>] : [];
type FirstLetterOf<T extends string> = SplittedFormOf<T>[0];
type DraggingObject = {
    'displayName': WAMLComponentType;
    'node': WAML.ButtonOption | WAML.PairingOption;
    'e': PointerEvent | MouseEvent;
    'currentTarget': HTMLElement;
    'callback'?: (value?: string) => void;
};
type Context = {
    'commonOptions': {
        [key in keyof WAMLViewerOptions as FirstLetterOf<key> extends Lowercase<FirstLetterOf<key>> ? key : never]: WAMLViewerOptions[key];
    };
    'draggingObject': DraggingObject | null;
    'interactionToken': InteractionToken;
    'metadata': WAML.Metadata;
    'pairing': {
        'pairedVertices': Record<string, Array<{
            netIndex: number;
        } & ({
            from: string;
        } | {
            to: string;
        })>>;
        'getDotRefs': (node: WAML.PairingOption) => {
            'refInbound': ($: HTMLElement | null) => void;
            'refOutbound': ($: HTMLElement | null) => void;
        };
        'getNetIndexByEdge': (from: string, to: string) => [number, string];
    };
    'renderingVariables': {
        'pendingAnswer': ReturnType<typeof flattenAnswer> | null;
        'pendingClasses': string[];
        'interactionTokenIndex': Record<string, number>;
        'buttonOptionUsed': Record<string, number[]>;
        'buttonOptions': Record<number, WAML.ButtonOption>;
        'namedInteractionTokens': Record<string, InteractionToken>;
        'pairingOptionDots': Record<string, [inbound: HTMLElement | null, outbound: HTMLElement | null]>;
    };
    'value': WAML.Answer | undefined;
    'checkButtonOptionUsed': (node: WAML.ButtonOption) => boolean;
    'getButtonOptionByValue': (value: string) => WAML.ButtonOption | null;
    'getComponentOptions': <T extends WAMLComponentType>(type: T) => WAMLViewerOptions[T];
    'getURL': (uri: string) => string;
    'invokeInteractionToken': (id: string) => InteractionToken;
    'setDraggingObject': (value: DraggingObject | null) => void;
    'setFlattenValue': (runner: (prev: ReturnType<typeof flattenAnswer>, interactions: WAML.Interaction[]) => false | typeof prev) => void;
};
type Props = {
    'document': WAMLDocument | WAML.ParserError;
    'options': WAMLViewerOptions;
    'defaultValue'?: WAML.Answer;
    'value'?: WAML.Answer;
    'onChange'?: (value: WAML.Answer) => void;
};
declare const useWAML: (invokingInteractionToken?: boolean) => Context;
export default useWAML;
export declare const WAMLProvider: FCWithChildren<Props>;
