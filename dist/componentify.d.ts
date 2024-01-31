import type { WAMLComponent, WAMLComponentType } from "./types.js";
export default function componentify<T extends WAMLComponentType>(Component: WAMLComponent<T>): WAMLComponent<T>;
