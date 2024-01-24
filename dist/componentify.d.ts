import type { WAMLComponent, WAMLComponentType } from "./types";
export default function componentify<T extends WAMLComponentType>(Component: WAMLComponent<T>): WAMLComponent<T>;
