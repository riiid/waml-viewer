export default class WAMLError extends Error {
    readonly node: any;
    constructor(message: string, node?: any);
}
export declare const NOT_YET_IMPLEMENTED: WAMLError;
