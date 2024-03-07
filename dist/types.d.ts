import type { WAML } from "@riiid/waml";
import type { FC, HTMLAttributes, ReactNode } from "react";
import type WAMLError from "./waml-error";
type Include<T, U> = T extends U ? T : never;
type WAMLComponentMap = {
    'Anchor': WAML.Anchor;
    'Audio': WAML.MooToken<'medium'>;
    'ButtonBlank': WAML.MooToken<'buttonBlank'>;
    'ButtonOption': WAML.ButtonOption;
    'ChoiceOption': WAML.ChoiceOption;
    'ChoiceOptionLine': Include<WAML.LineComponent, {
        kind: "LineComponent";
    }>;
    'Document': WAML.Document;
    'FigureCaption': WAML.FigureAddon;
    'FigureTitle': WAML.FigureAddon;
    'Footnote': WAML.Footnote;
    'HR': WAML.MooToken<'hr'>;
    'Image': WAML.MooToken<'medium'>;
    'Inline': WAML.Inline;
    'Line': WAML.Line;
    'LineComponent': WAML.LineComponent;
    'LongLingualOption': WAML.MooToken<'longLingualOption'>;
    'PairingLine': string;
    'PairingOption': WAML.PairingOption;
    'PairingOptionGroup': WAML.PairingOption[];
    'Passage': WAML.Directive & {
        name: "passage";
    };
    'PrefixedLine': WAML.Line[];
    'SemanticErrorHandler': WAMLError;
    'ShortLingualOption': WAML.ShortLingualOption;
    'SyntaxErrorHandler': WAML.ParserError;
    'Table': WAML.LineXMLElement & {
        tag: "table";
    };
    'Video': WAML.MooToken<'medium'>;
};
type WAMLComponentAdditionalPropsMap = {
    [key in keyof WAMLComponentMap]: unknown;
} & {
    'ChoiceOption': {
        onInteract?: (value: boolean) => void;
    };
    'Line': {
        next?: WAML.Line;
    };
    'PairingLine': {
        'from': HTMLElement;
        'to': HTMLElement;
    };
    'Passage': {
        fallback?: ReactNode;
    };
    'PrefixedLine': {
        'type': "Question" | "Quotation" | "Indentation";
        'depth': number;
    };
    'ShortLingualOption': {
        inline: boolean;
    };
};
type WAMLComponentPropsBase = Omit<HTMLAttributes<HTMLElement>, 'children'>;
export type FCWithChildren<T = {}> = FC<T & {
    children: ReactNode;
}>;
export type WAMLComponentType = keyof WAMLComponentMap;
export type WAMLViewerOptions = {
    'uriResolver'?: (uri: string) => string;
    'noDefaultClassName'?: boolean;
    'explanationWrapper'?: Element;
    'builtinCSS'?: string;
    'prefixedLineClassMap'?: Record<string, string>;
    'debug'?: boolean;
} & {
    [key in WAMLComponentType]?: WAMLComponentPropsBase | FCWithChildren<{
        node: WAMLComponentMap[key];
    } & WAMLComponentAdditionalPropsMap[key]> | {
        getter: (node: WAMLComponentMap[key]) => WAMLComponentPropsBase & Record<`data-${string}`, string | undefined>;
    };
};
export interface WAMLComponent<T extends WAMLComponentType> extends FC<WAMLComponentProps<T>> {
    displayName: T;
}
export type WAMLComponentProps<T extends WAMLComponentType> = WAMLComponentPropsBase & WAMLComponentAdditionalPropsMap[T] & {
    node: WAMLComponentMap[T];
};
export type ASTMiddleware = (documemt: WAML.Document, metadata: WAML.Metadata) => boolean;
export type WAMLUserInteraction = {
    'timestamp'?: number;
} & ({
    'type': "choice-interaction-click";
    'value': string;
} | {
    'type': "medium-play" | "medium-pause";
    'url': string;
    /**
     * 매체의 진행 정도를 백분율로 나타낸 값.
     * 1인 경우 모두 재생했음을 의미한다.
     */
    'progress': number;
} | {
    'type': "medium-volume-set";
    'url': string;
    'value': number;
});
export {};
