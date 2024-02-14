import { type WAMLComponent, type WAMLComponentType } from "./types.js";
export default function componentify<T extends WAMLComponentType>(Component: WAMLComponent<T>): WAMLComponent<T>;
