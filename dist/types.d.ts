import type { FC, HTMLAttributes, ReactNode } from "react";
export type FCWithChildren<T = {}> = FC<T & {
    children: ReactNode;
}>;
export interface WAMLComponentProps<T> extends HTMLAttributes<HTMLElement> {
    node: T;
}
