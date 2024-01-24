/* eslint-disable @jjoriping/variable-name */
import type { WAML } from "@riiid/waml";
import type { FC, HTMLAttributes, ReactNode } from "react";
import type WAMLError from "./waml-error";

type WAMLComponentMap = {
  'SyntaxErrorHandler': WAML.ParserError,
  'SemanticErrorHandler': WAMLError,
  'Document': WAML.Document
};
type WAMLComponentPropsBase = Omit<HTMLAttributes<HTMLElement>, 'children'>;

export type FCWithChildren<T = {}> = FC<T&{ children: ReactNode }>;
// eslint-disable-next-line @jjoriping/no-type-name-affix
export type WAMLComponentType = keyof WAMLComponentMap;
export type WAMLViewerOptions = {
  'noDefaultClassName'?: boolean,
  'explanationWrapper'?: Element,
  'debug'?: boolean
}&{
  [key in WAMLComponentType]?: WAMLComponentPropsBase|FCWithChildren<{ node: WAMLComponentMap[key] }>;
};

export interface WAMLComponent<T extends WAMLComponentType> extends FC<WAMLComponentProps<T>>{
  displayName:T;
}
export interface WAMLComponentProps<T extends WAMLComponentType> extends WAMLComponentPropsBase{
  node:WAMLComponentMap[T];
}