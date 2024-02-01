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
    'debug'?: boolean;
} & {
    [key in WAMLComponentType]?: WAMLComponentPropsBase | FCWithChildren<{
        node: WAMLComponentMap[key];
    } & WAMLComponentAdditionalPropsMap[key]>;
};
export interface WAMLComponent<T extends WAMLComponentType> extends FC<WAMLComponentProps<T>> {
    displayName: T;
}
export type WAMLComponentProps<T extends WAMLComponentType> = WAMLComponentPropsBase & WAMLComponentAdditionalPropsMap[T] & {
    node: WAMLComponentMap[T];
};
export type ASTMiddleware = (documemt: WAML.Document, metadata: WAML.Metadata) => boolean;
export {};
